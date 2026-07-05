import { useState } from 'react'
import { ethers } from 'ethers'
import { setBudget, approveUsdc, fundJob, submitDeliverable, completeJob } from '../../../lib/blockchain/jobs'
import { ZERO_ADDRESS } from '../../../lib/blockchain/constants'
import { useAsyncAction } from '../../../hooks/useAsyncAction'
import { useToast } from '../../../hooks/useToast'
import { Panel, Button, Badge, FieldGroup, Input, Textarea } from '../../../ui/design-system'
import { Alert } from '../../../ui/Alert'
import { shortAddr } from '../../../lib/format'
import { IconZap } from '../../../ui/icons'

/** Resolves the single correct next action for a job, or null if it's terminal. */
function resolveNextAction(job, allowance) {
  if (!job) return null

  switch (job.status) {
    case 0: // Open
      if (job.budget === 0n) return { key: 'setBudget', role: 'client', allowedAddress: job.client, roleLabel: 'client' }
      if (allowance === null || allowance === undefined) return { key: 'loading' }
      if (allowance < job.budget) return { key: 'approve', role: 'client', allowedAddress: job.client, roleLabel: 'client' }
      return { key: 'fund', role: 'client', allowedAddress: job.client, roleLabel: 'client' }
    case 1: // Funded
      return { key: 'submit', role: 'provider', allowedAddress: job.provider, roleLabel: 'provider' }
    case 2: { // Submitted
      const completer = job.evaluator !== ZERO_ADDRESS ? job.evaluator : job.client
      const roleLabel = job.evaluator !== ZERO_ADDRESS ? 'evaluator' : 'client'
      return { key: 'complete', role: 'evaluator', allowedAddress: completer, roleLabel }
    }
    default:
      return null // Completed / Rejected / Expired
  }
}

export function JobActionPanel({ job, account, signer, allowance, arcExplorer, addActivity, onChanged }) {
  const { run, loading, error, success, reset } = useAsyncAction()
  const { toast } = useToast()

  const [budgetInput, setBudgetInput] = useState('')
  const [deliverableText, setDeliverableText] = useState('')
  const [reasonText, setReasonText] = useState('')
  const [formError, setFormError] = useState(null)

  const action = resolveNextAction(job, allowance)

  if (!job) return null

  if (!action) {
    return (
      <Panel icon={<IconZap width={18} height={18} />} title="Job actions" className="jv7-action-panel">
        <Badge variant={job.status === 3 ? 'completed' : 'rejected'}>{job.statusLabel}</Badge>
        <p className="panel-desc" style={{ marginTop: 10 }}>
          {job.status === 3
            ? 'This job is complete. No further action is needed.'
            : 'This job has reached a terminal state and has no further actions.'}
        </p>
      </Panel>
    )
  }

  if (action.key === 'loading') {
    return (
      <Panel icon={<IconZap width={18} height={18} />} title="Job actions" className="jv7-action-panel">
        <div className="jv7-action-loading-hint">
          <span className="ds-spinner" aria-hidden="true" /> Checking USDC allowance…
        </div>
      </Panel>
    )
  }

  const isCorrectWallet = account && action.allowedAddress && account.toLowerCase() === action.allowedAddress.toLowerCase()
  const clearState = () => { setFormError(null); reset() }

  const handleSetBudget = async () => {
    setFormError(null)
    const trimmed = budgetInput.trim()
    if (!trimmed || Number(trimmed) <= 0) return setFormError('Enter a budget greater than 0')

    let parsed
    try {
      parsed = ethers.parseUnits(trimmed, 6)
    } catch {
      return setFormError('Invalid budget amount')
    }

    const result = await run(() => setBudget(signer, job.id, parsed))
    if (result) {
      addActivity?.({ type: 'job', label: `Budget set for Job #${job.id}`, txHash: result.txHash, status: 'success' })
      toast({ title: 'Budget set', description: `${trimmed} USDC`, variant: 'success' })
      onChanged?.()
    } else {
      addActivity?.({ type: 'job', label: `Set budget failed for Job #${job.id}`, status: 'error' })
    }
  }

  const handleApprove = async () => {
    setFormError(null)
    const result = await run(() => approveUsdc(signer, job.budget))
    if (result) {
      addActivity?.({ type: 'job', label: `USDC approved for Job #${job.id}`, txHash: result.txHash, status: 'success' })
      toast({ title: 'USDC approved', description: `${job.budgetFormatted} USDC`, variant: 'success' })
      onChanged?.()
    } else {
      addActivity?.({ type: 'job', label: `Approve failed for Job #${job.id}`, status: 'error' })
    }
  }

  const handleFund = async () => {
    setFormError(null)
    const result = await run(() => fundJob(signer, job.id))
    if (result) {
      addActivity?.({ type: 'job', label: `Job #${job.id} funded`, txHash: result.txHash, status: 'success' })
      toast({ title: 'Job funded', variant: 'success' })
      onChanged?.()
    } else {
      addActivity?.({ type: 'job', label: `Fund failed for Job #${job.id}`, status: 'error' })
    }
  }

  const handleSubmit = async () => {
    setFormError(null)
    if (!deliverableText.trim()) return setFormError('Describe the deliverable before submitting')

    const result = await run(() => submitDeliverable(signer, job.id, deliverableText.trim()))
    if (result) {
      addActivity?.({ type: 'job', label: `Deliverable submitted for Job #${job.id}`, txHash: result.txHash, status: 'success' })
      toast({ title: 'Deliverable submitted', variant: 'success' })
      onChanged?.()
    } else {
      addActivity?.({ type: 'job', label: `Submit failed for Job #${job.id}`, status: 'error' })
    }
  }

  const handleComplete = async () => {
    setFormError(null)
    if (!reasonText.trim()) return setFormError('Add an approval note before completing')

    const result = await run(() => completeJob(signer, job.id, reasonText.trim()))
    if (result) {
      addActivity?.({ type: 'job', label: `Job #${job.id} completed`, txHash: result.txHash, status: 'success' })
      toast({ title: 'Job completed', variant: 'success' })
      onChanged?.()
    } else {
      addActivity?.({ type: 'job', label: `Complete failed for Job #${job.id}`, status: 'error' })
    }
  }

  return (
    <Panel
      icon={<IconZap width={18} height={18} />}
      title="Job actions"
      subtitle={`Next step: ${actionTitle(action.key)}`}
      className="jv7-action-panel"
    >
      {!isCorrectWallet && (
        <Alert variant="warning" title="Wrong wallet">
          Only the job&apos;s {action.roleLabel} (<span className="mono">{shortAddr(action.allowedAddress)}</span>) can perform this step.
        </Alert>
      )}

      {action.key === 'setBudget' && (
        <FieldGroup label="Budget (USDC)" hint="Pulled from the connected client wallet once approved and funded">
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="100"
            value={budgetInput}
            onChange={(e) => { clearState(); setBudgetInput(e.target.value) }}
            disabled={loading || !isCorrectWallet}
          />
        </FieldGroup>
      )}

      {action.key === 'submit' && (
        <FieldGroup label="Deliverable" hint="Hashed with keccak256 before being sent on-chain">
          <Textarea
            rows={4}
            placeholder="Describe or link the completed work…"
            value={deliverableText}
            onChange={(e) => { clearState(); setDeliverableText(e.target.value) }}
            disabled={loading || !isCorrectWallet}
          />
        </FieldGroup>
      )}

      {action.key === 'complete' && (
        <FieldGroup label="Approval note" hint="Hashed with keccak256 before being sent on-chain">
          <Textarea
            rows={4}
            placeholder="Reason for approving this deliverable…"
            value={reasonText}
            onChange={(e) => { clearState(); setReasonText(e.target.value) }}
            disabled={loading || !isCorrectWallet}
          />
        </FieldGroup>
      )}

      {action.key === 'approve' && (
        <p className="panel-desc">
          Approve the Agentic Commerce contract to pull <strong>{job.budgetFormatted} USDC</strong> from your wallet when the job is funded.
        </p>
      )}

      {action.key === 'fund' && (
        <p className="panel-desc">
          USDC is approved. Fund the job to lock <strong>{job.budgetFormatted} USDC</strong> in escrow for the provider.
        </p>
      )}

      {(formError || error) && <Alert variant="error" title="Action failed">{formError || error}</Alert>}

      {success && (
        <Alert variant="success" title="Transaction confirmed">
          <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
            View transaction ↗
          </a>
        </Alert>
      )}

      <Button
        variant="primary"
        block
        loading={loading}
        disabled={!signer || !isCorrectWallet}
        onClick={
          action.key === 'setBudget' ? handleSetBudget
          : action.key === 'approve' ? handleApprove
          : action.key === 'fund' ? handleFund
          : action.key === 'submit' ? handleSubmit
          : handleComplete
        }
      >
        {actionTitle(action.key)}
      </Button>
    </Panel>
  )
}

function actionTitle(key) {
  switch (key) {
    case 'setBudget': return 'Set Budget'
    case 'approve': return 'Approve USDC'
    case 'fund': return 'Fund Job'
    case 'submit': return 'Submit Deliverable'
    case 'complete': return 'Complete Job'
    default: return ''
  }
}
