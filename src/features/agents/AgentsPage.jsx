import { useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useContractWrite } from '../../hooks/useContractWrite'
import { CONTRACTS } from '../../contracts/registry'
import { Card, CardBody, PanelHeader } from '../../ui/Card'
import { FieldGroup, Input } from '../../ui/Field'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Spinner } from '../../ui/Spinner'
import { CopyButton } from '../../ui/CopyButton'
import { IconAgent } from '../../ui/icons'

export default function AgentsPage() {
  const { signer, account, agentId, setAgentId, addActivity, arcExplorer } = useWalletContext()
  const [metadataURI, setMetadataURI] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { execute, loading, error, success, reset } = useContractWrite({
    address: CONTRACTS.IDENTITY_REGISTRY.address,
    abi: CONTRACTS.IDENTITY_REGISTRY.abi,
    signer,
  })

  const clearOnEdit = (setter) => (e) => {
    setSubmitted(false)
    reset()
    setter(e.target.value)
  }

  const handleRegister = async () => {
    if (!metadataURI.trim()) return

    setSubmitted(false)

    const result = await execute('register', [metadataURI.trim()])
    if (!result) {
      addActivity({ type: 'register', label: 'Agent registration failed', status: 'error' })
      return
    }

    const iface = new ethers.Interface(CONTRACTS.IDENTITY_REGISTRY.abi)
    let registeredAgentId = null

    for (const log of result.receipt.logs) {
      try {
        const parsed = iface.parseLog(log)
        if (parsed && parsed.name === 'Transfer') {
          registeredAgentId = parsed.args.tokenId.toString()
          break
        }
      } catch {
        // not a Transfer log from this contract — skip
      }
    }

    if (!registeredAgentId) {
      registeredAgentId = result.receipt.logs?.[0]?.topics?.[3]
        ? BigInt(result.receipt.logs[0].topics[3]).toString()
        : 'Unknown'
    }

    setAgentId(registeredAgentId)
    setSubmitted(true)

    addActivity({
      type: 'register',
      label: 'Agent registered',
      agentId: registeredAgentId,
      txHash: result.txHash,
      status: 'success',
    })
  }

  return (
    <div className="two-col">
      <Card>
        <CardBody>
          <PanelHeader icon={<IconAgent width={18} height={18} />} title="Register agent" subtitle="ERC-8004 Identity Registry" />
          <p className="panel-desc">
            Register a new AI agent on Arc Testnet. Your agent ID is saved and reused automatically across
            Reputation and Validation.
          </p>

          <FieldGroup label="Metadata URI" hint="Points to your agent's metadata JSON (IPFS or HTTPS)">
            <Input
              type="text"
              placeholder="ipfs://Qm... or https://..."
              value={metadataURI}
              onChange={clearOnEdit(setMetadataURI)}
              disabled={loading}
            />
          </FieldGroup>

          {error && <Alert variant="error" title="Registration failed">{error}</Alert>}

          {success && (
            <Alert variant="success" title="Agent registered">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>Agent ID: <strong className="mono">#{agentId}</strong></span>
                <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                  View transaction ↗
                </a>
              </div>
            </Alert>
          )}

          <Button variant="primary" className="btn-block" onClick={handleRegister} disabled={loading || !signer || submitted}>
            {submitted ? '✓ Registered' : loading ? (<><Spinner /> Registering…</>) : 'Register agent'}
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <PanelHeader title="Agent profile" subtitle="Current registration status" />
          {agentId ? (
            <div className="kv-grid">
              <div className="kv-row">
                <span className="kv-label">Agent ID</span>
                <span className="kv-value">#{agentId}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Owner</span>
                <span className="kv-value">{account}<CopyButton value={account} label="" /></span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Registry</span>
                <a
                  className="kv-value tx-link"
                  href={`${arcExplorer}/address/${CONTRACTS.IDENTITY_REGISTRY.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on ArcScan ↗
                </a>
              </div>
            </div>
          ) : (
            <p className="panel-desc" style={{ marginBottom: 0 }}>
              No agent registered yet on this wallet. Register one to unlock Reputation and Validation.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
