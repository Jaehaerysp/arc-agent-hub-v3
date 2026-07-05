import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { useToast } from '../../hooks/useToast'
import { createJob, setBudget } from '../../lib/blockchain/jobs'
import { Panel, FieldGroup, Input, Textarea, Button, Badge } from '../../ui/design-system'
import { Alert } from '../../ui/Alert'
import { IconJob } from '../../ui/icons'

export default function CreateJobPage() {
  const { signer, account, addActivity, arcExplorer } = useWalletContext()
  const { run, loading, error, success, reset } = useAsyncAction()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const hiredProvider = location.state?.provider || ''
  const hiredAgentName = location.state?.agentName || null

  const [provider, setProvider] = useState(hiredProvider)
  const [evaluator, setEvaluator] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudgetInput] = useState('')
  const [expiration, setExpiration] = useState('')
  const [formError, setFormError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(null)

  const clearState = (setter) => (e) => {
    setFormError(null)
    reset()
    setSubmitted(false)
    setter(e.target.value)
  }

  const handleCreate = async () => {
    setFormError(null)

    const trimmedProvider = provider.trim()
    if (!trimmedProvider || !ethers.isAddress(trimmedProvider)) return setFormError('Valid provider address required')
    if (evaluator.trim() && !ethers.isAddress(evaluator.trim())) return setFormError('Evaluator must be a valid address, or left blank')
    if (!description.trim()) return setFormError('Description is required')

    let expiredAt
    if (expiration) {
      const ms = new Date(expiration).getTime()
      if (Number.isNaN(ms)) return setFormError('Invalid expiration date')
      if (ms <= Date.now()) return setFormError('Expiration must be in the future')
      expiredAt = BigInt(Math.floor(ms / 1000))
    }

    let parsedBudget = null
    if (budget.trim()) {
      if (Number(budget.trim()) <= 0) return setFormError('Budget must be greater than 0')
      try {
        parsedBudget = ethers.parseUnits(budget.trim(), 6)
      } catch {
        return setFormError('Invalid budget amount')
      }
    }

    setStep(parsedBudget ? 'Creating job (1/2)…' : 'Creating job…')

    const result = await run(async () => {
      const created = await createJob(signer, {
        provider: trimmedProvider,
        evaluator: evaluator.trim() || undefined,
        description: description.trim(),
        expiredAt,
      })

      addActivity({ type: 'job', label: `Job #${created.jobId ?? '?'} created`, txHash: created.txHash, status: 'success' })

      if (parsedBudget && created.jobId) {
        setStep('Setting budget (2/2)…')
        try {
          const budgetResult = await setBudget(signer, created.jobId, parsedBudget)
          addActivity({ type: 'job', label: `Budget set for Job #${created.jobId}`, txHash: budgetResult.txHash, status: 'success' })
        } catch (e) {
          toast({
            title: 'Job created, but budget was not set',
            description: e?.reason || e?.shortMessage || e?.message || 'You can set it from the job page.',
            variant: 'error',
          })
        }
      }

      return created
    })

    setStep(null)

    if (result?.jobId) {
      setSubmitted(true)
      toast({ title: 'Job created', description: `Job #${result.jobId}`, variant: 'success' })
      navigate(`/jobs/${result.jobId}`)
    } else if (result && !result.jobId) {
      toast({ title: 'Job created, but the job ID could not be read from the transaction.', variant: 'error' })
    } else {
      addActivity({ type: 'job', label: 'Job creation failed', status: 'error' })
    }
  }

  return (
    <div className="two-col jv7-create-layout">
      <Panel icon={<IconJob width={18} height={18} />} title="Create job" subtitle="ERC-8183 Agentic Commerce" className="jv7-detail-panel">
        {hiredAgentName && (
          <Alert variant="success" title={`Hiring: ${hiredAgentName}`}>
            The provider address below is pre-filled from the marketplace. You can still change it before submitting.
          </Alert>
        )}

        <p className="panel-desc">
          Creates a new job for a provider address. If you set a budget here, it&apos;s applied automatically right after creation —
          you&apos;ll still need to approve USDC and fund the job from the job page.
        </p>

        <FieldGroup label="Provider address" hint="The agent or wallet that will perform the work">
          <Input type="text" placeholder="0x..." value={provider} onChange={clearState(setProvider)} disabled={loading} />
        </FieldGroup>

        <FieldGroup label={<>Evaluator address <Badge variant="muted">optional</Badge></>} hint="Leave blank to let the client approve completion">
          <Input type="text" placeholder="0x... (defaults to none)" value={evaluator} onChange={clearState(setEvaluator)} disabled={loading} />
        </FieldGroup>

        <FieldGroup label="Description">
          <Textarea rows={3} placeholder="What is this job for?" value={description} onChange={clearState(setDescription)} disabled={loading} />
        </FieldGroup>

        <FieldGroup label={<>Budget (USDC) <Badge variant="muted">optional</Badge></>} hint="Applied via a second transaction right after the job is created">
          <Input type="number" min="0" step="0.01" placeholder="100" value={budget} onChange={clearState(setBudgetInput)} disabled={loading} />
        </FieldGroup>

        <FieldGroup label={<>Expiration <Badge variant="muted">optional</Badge></>} hint="Defaults to 1 hour from now if left blank">
          <Input type="datetime-local" value={expiration} onChange={clearState(setExpiration)} disabled={loading} />
        </FieldGroup>

        {(formError || error) && <Alert variant="error" title="Create job failed">{formError || error}</Alert>}

        {success?.txHash && (
          <Alert variant="success" title="Job created">
            <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
              View transaction ↗
            </a>
          </Alert>
        )}

        <Button variant="primary" block loading={loading} onClick={handleCreate} disabled={loading || !signer || submitted}>
          {loading ? (step || 'Creating…') : submitted ? '✓ Created' : 'Create Job'}
        </Button>

        {!account && <p className="field-hint" style={{ marginTop: 10 }}>Connect your wallet to create a job.</p>}
      </Panel>
    </div>
  )
}
