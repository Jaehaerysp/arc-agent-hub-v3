import { useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useContractWrite } from '../../hooks/useContractWrite'
import { useBalances } from '../../hooks/useBalances'
import { CONTRACTS } from '../../contracts/registry'
import { Card, CardBody, PanelHeader } from '../../ui/Card'
import { FieldGroup, Input } from '../../ui/Field'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Spinner } from '../../ui/Spinner'
import { EmptyState } from '../../ui/EmptyState'
import { formatTokenAmount, shortHash, formatTime } from '../../lib/format'
import { IconTransfer } from '../../ui/icons'

export default function TransferPage() {
  const { signer, account, provider, addActivity, activity, arcExplorer } = useWalletContext()
  const { anvBalance, refresh } = useBalances(provider, account)

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)

  const { execute, loading, error, success, reset } = useContractWrite({
    address: CONTRACTS.ANV_TOKEN.address,
    abi: CONTRACTS.ANV_TOKEN.abi,
    signer,
    addActivity,
  })

  const clearState = () => {
    setSubmitted(false)
    setFormError(null)
    reset()
  }

  const handleMax = () => {
    if (anvBalance !== null) {
      clearState()
      setAmount(anvBalance.toString())
    }
  }

  const handleTransfer = async () => {
    setFormError(null)

    if (!to.trim() || !ethers.isAddress(to.trim())) return setFormError('Valid recipient address required')
    if (!amount || Number(amount) <= 0) return setFormError('Valid amount required')

    const parsedAmount = ethers.parseUnits(amount, 18)

    const result = await execute(
      'transfer',
      [to.trim(), parsedAmount],
      { type: 'transfer', label: 'ANV transfer', failLabel: 'Transfer failed' }
    )

    if (result) {
      setSubmitted(true)
      refresh()
    }
  }

  const recentTransfers = activity.filter((a) => a.type === 'transfer').slice(0, 5)

  return (
    <div className="two-col">
      <Card>
        <CardBody>
          <PanelHeader icon={<IconTransfer width={18} height={18} />} title="Transfer ANV" subtitle="Send ANV tokens on Arc Testnet" />

          <div className="settings-row" style={{ paddingTop: 0 }}>
            <span className="settings-row-label">Available balance</span>
            <span className="settings-row-value mono">{formatTokenAmount(anvBalance, 4)} ANV</span>
          </div>

          <FieldGroup label="Recipient address">
            <Input type="text" placeholder="0x..." value={to} onChange={(e) => { clearState(); setTo(e.target.value) }} disabled={loading} />
          </FieldGroup>

          <FieldGroup label="Amount">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input type="number" value={amount} onChange={(e) => { clearState(); setAmount(e.target.value) }} disabled={loading} />
              <Button variant="secondary" size="sm" onClick={handleMax} disabled={loading || anvBalance === null}>
                Max
              </Button>
            </div>
          </FieldGroup>

          {(formError || error) && <Alert variant="error" title="Transfer failed">{formError || error}</Alert>}

          {success && (
            <Alert variant="success" title="Transfer sent">
              <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                View transaction ↗
              </a>
            </Alert>
          )}

          <Button variant="primary" className="btn-block" onClick={handleTransfer} disabled={loading || !signer || submitted}>
            {submitted ? '✓ Sent' : loading ? (<><Spinner /> Sending…</>) : 'Send ANV'}
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <PanelHeader title="Recent transfers" />
          {recentTransfers.length === 0 ? (
            <EmptyState icon="↔" title="No transfers yet" description="Transfers you send will appear here." />
          ) : (
            <div className="activity-list">
              {recentTransfers.map((item) => (
                <div key={item.id} className={`activity-item ${item.status}`}>
                  <div className="activity-main">
                    <div className="activity-title">{item.label}</div>
                    {item.detail && <div className="activity-detail">{item.detail}</div>}
                  </div>
                  <div className="activity-meta">
                    {item.txHash && (
                      <a href={`${arcExplorer}/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                        {shortHash(item.txHash)}
                      </a>
                    )}
                    <div className="activity-time">{formatTime(item.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
