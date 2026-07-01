import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useContractWrite } from '../../hooks/useContractWrite'
import { CONTRACTS } from '../../contracts/registry'
import { Card, CardBody, PanelHeader } from '../../ui/Card'
import { FieldGroup, Input, Textarea, Select, PrefixInput } from '../../ui/Field'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Spinner } from '../../ui/Spinner'
import { Badge } from '../../ui/Badge'
import { IconStar } from '../../ui/icons'

const FEEDBACK_TYPES = { Peer: 1, Validator: 2, Community: 3 }

const SCORE_LABELS = [
  '', '😞 Terrible', '😟 Very Poor', '😕 Poor', '😐 Below Avg', '🙂 Average',
  '😊 Good', '😀 Very Good', '🤩 Excellent', '⭐ Outstanding', '🏆 Perfect',
]

export default function ReputationPage() {
  const { signer, agentId: sharedAgentId, addActivity, arcExplorer } = useWalletContext()

  const [agentId, setAgentId] = useState('')
  const [score, setScore] = useState(8)
  const [feedbackType, setFeedbackType] = useState('Validator')
  const [tag, setTag] = useState('validated_agent')
  const [metadataURI, setMetadataURI] = useState('ipfs://bafkreihanmd4ksidq5v4qwi3hdf3g42fnttmsdzzfelzkczi77svr4vmu4')
  const [evidenceURI, setEvidenceURI] = useState('ipfs://bafkreiak2pj4452l5i6325zdpf3aolek7cfa4lr4czchvbjxa4sba6k6py')
  const [comment, setComment] = useState('Third-party validator review for successful Arc protocol workflow execution.')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)

  const { execute, loading, error, success, reset } = useContractWrite({
    address: CONTRACTS.REPUTATION_REGISTRY.address,
    abi: CONTRACTS.REPUTATION_REGISTRY.abi,
    signer,
    addActivity,
  })

  useEffect(() => {
    if (sharedAgentId) setAgentId(sharedAgentId.toString())
  }, [sharedAgentId])

  const clearState = () => {
    setSubmitted(false)
    setFormError(null)
    reset()
  }

  const handleSubmit = async () => {
    setFormError(null)

    if (!agentId.trim()) return setFormError('Agent ID is required')
    if (!tag.trim()) return setFormError('Tag is required')
    if (!metadataURI.trim()) return setFormError('Metadata URI is required')
    if (!evidenceURI.trim()) return setFormError('Evidence URI is required')
    if (!comment.trim()) return setFormError('Comment is required')

    const scoreNum = Number(score)
    if (!Number.isInteger(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      return setFormError('Score must be between 1 and 10')
    }

    const reviewer = await signer.getAddress()

    const feedbackHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        JSON.stringify({
          agentId, score: scoreNum, feedbackType, tag, metadataURI, evidenceURI, comment, reviewer, timestamp: Date.now(),
        })
      )
    )

    // NOTE: the baseline project called contract.giveFeedback(...) twice here —
    // once discarded, once awaited — which submitted every feedback as two
    // separate on-chain transactions. Fixed: exactly one call via useContractWrite.
    const result = await execute(
      'giveFeedback',
      [
        BigInt(agentId.trim()),
        BigInt(scoreNum),
        FEEDBACK_TYPES[feedbackType],
        tag.trim(),
        metadataURI.trim(),
        evidenceURI.trim(),
        comment.trim(),
        feedbackHash,
      ],
      { type: 'feedback', label: 'Reputation feedback', failLabel: 'Feedback failed', agentId: agentId.trim(), score: scoreNum }
    )

    if (result) setSubmitted(true)
  }

  const pct = `${((score - 1) / 9) * 100}%`

  return (
    <Card className="rep-panel">
      <CardBody>
        <PanelHeader icon={<IconStar width={18} height={18} />} title="Reputation feedback" subtitle="Submit a review via giveFeedback" />

        <FieldGroup label={<>Agent ID {sharedAgentId && <Badge variant="accent">auto-filled</Badge>}</>}>
          <PrefixInput prefix="#" type="number" value={agentId} onChange={(e) => { clearState(); setAgentId(e.target.value) }} disabled={loading} />
        </FieldGroup>

        <div className="rep-score-block field-group">
          <div className="rep-score-header">
            <label>Score (1–10)</label>
            <div className="rep-score-display">
              <span className="rep-score-number">{score}</span>
              <span className="rep-score-max">/10</span>
              <span className="rep-score-emoji">{SCORE_LABELS[score]}</span>
            </div>
          </div>
          <input
            className="slider"
            type="range"
            min="1"
            max="10"
            step="1"
            value={score}
            onChange={(e) => { clearState(); setScore(Number(e.target.value)) }}
            disabled={loading}
            style={{ '--pct': pct }}
          />
        </div>

        <FieldGroup label="Feedback type">
          <Select value={feedbackType} onChange={(e) => { clearState(); setFeedbackType(e.target.value) }} disabled={loading}>
            <option>Peer</option>
            <option>Validator</option>
            <option>Community</option>
          </Select>
        </FieldGroup>

        <FieldGroup label="Tag">
          <Input value={tag} onChange={(e) => { clearState(); setTag(e.target.value) }} disabled={loading} />
        </FieldGroup>

        <FieldGroup label="Metadata URI">
          <Input value={metadataURI} onChange={(e) => { clearState(); setMetadataURI(e.target.value) }} disabled={loading} />
        </FieldGroup>

        <FieldGroup label="Evidence URI">
          <Input value={evidenceURI} onChange={(e) => { clearState(); setEvidenceURI(e.target.value) }} disabled={loading} />
        </FieldGroup>

        <FieldGroup label="Comment">
          <Textarea rows={4} value={comment} onChange={(e) => { clearState(); setComment(e.target.value) }} disabled={loading} />
        </FieldGroup>

        {(formError || error) && <Alert variant="error" title="Submission failed">{formError || error}</Alert>}

        {success && (
          <Alert variant="success" title="Feedback submitted">
            <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
              View transaction ↗
            </a>
          </Alert>
        )}

        <Button variant="primary" className="btn-block" onClick={handleSubmit} disabled={loading || !signer || submitted}>
          {submitted ? '✓ Submitted' : loading ? (<><Spinner /> Submitting…</>) : 'Submit feedback'}
        </Button>

        {!signer && <p className="field-hint" style={{ marginTop: 10, textAlign: 'center' }}>Connect your wallet to submit feedback</p>}
      </CardBody>
    </Card>
  )
}
