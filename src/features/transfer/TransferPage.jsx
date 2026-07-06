import { useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useContractWrite } from '../../hooks/useContractWrite'
import { useBalances } from '../../hooks/useBalances'
import { CONTRACTS } from '../../contracts/registry'
import { Container, Section, Panel, FieldGroup, Input, Button, Badge } from '../../ui/design-system'
import { Alert } from '../../ui/Alert'
import { formatTokenAmount, shortAddr } from '../../lib/format'
import { IconTransfer, IconCheck } from '../../ui/icons'
import { TransferHero } from './components/TransferHero'
import { TransferHistoryTable } from './components/TransferHistoryTable'

/**
 * Transfer v7 (Mission 8) — same ANV transfer flow as before (identical
 * `useContractWrite` call against `CONTRACTS.ANV_TOKEN`, identical
 * validation), restyled into the v7 design system and split into the
 * brief's named sections: Hero -> Form -> Preview -> Confirmation ->
 * Progress -> History.
 *
 * The only non-visual change is passing a human-readable `detail` string
 * into `addActivity` (e.g. "12.5 ANV -> 0x1234…abcd") so Transfer History
 * and Wallet's Recent Transactions have real content in their Amount
 * column — the transaction itself (method, args, signer) is untouched.
 */
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

  const toTrimmed = to.trim()
  const isValidRecipient = toTrimmed && ethers.isAddress(toTrimmed)
  const isValidAmount = amount && Number(amount) > 0
  const showPreview = isValidRecipient && isValidAmount && !submitted && !success

  const handleTransfer = async () => {
    setFormError(null)

    if (!toTrimmed || !ethers.isAddress(toTrimmed)) return setFormError('Valid recipient address required')
    if (!amount || Number(amount) <= 0) return setFormError('Valid amount required')

    const parsedAmount = ethers.parseUnits(amount, 18)

    const result = await execute(
      'transfer',
      [toTrimmed, parsedAmount],
      {
        type: 'transfer',
        label: 'ANV transfer',
        failLabel: 'Transfer failed',
        detail: `${amount} ANV → ${shortAddr(toTrimmed)}`,
      }
    )

    if (result) {
      setSubmitted(true)
      refresh()
    }
  }

  const transfers = activity.filter((a) => a.type === 'transfer')

  return (
    <Container size="wide" className="wv7-transfer-page">
      <Section spacing="md">
        <TransferHero anvBalance={anvBalance} loading={anvBalance === null} />
      </Section>

      <Section spacing="md">
        <Panel
          icon={<IconTransfer width={18} height={18} />}
          title="Transfer Form"
          subtitle="Send ANV tokens on Arc Testnet"
          className="wv7-transfer-form-panel"
        >
          <div className="wv7-transfer-balance-row">
            <span className="wv7-transfer-balance-label">Available balance</span>
            <span className="wv7-transfer-balance-value mono">{formatTokenAmount(anvBalance, 4)} ANV</span>
          </div>

          <FieldGroup label="Recipient address">
            <Input
              type="text"
              placeholder="0x..."
              value={to}
              onChange={(e) => { clearState(); setTo(e.target.value) }}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Amount">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input type="number" value={amount} onChange={(e) => { clearState(); setAmount(e.target.value) }} disabled={loading} />
              <Button variant="secondary" size="sm" onClick={handleMax} disabled={loading || anvBalance === null}>
                Max
              </Button>
            </div>
          </FieldGroup>

          {showPreview && (
            <div className="wv7-transfer-preview" aria-label="Transaction preview">
              <div className="wv7-transfer-preview-title">Transaction Preview</div>
              <div className="wv7-transfer-preview-row">
                <span>Sending</span>
                <span className="mono">{amount} ANV</span>
              </div>
              <div className="wv7-transfer-preview-row">
                <span>To</span>
                <span className="mono">{shortAddr(toTrimmed)}</span>
              </div>
              <div className="wv7-transfer-preview-row">
                <span>Network</span>
                <span>Arc Testnet</span>
              </div>
            </div>
          )}

          {(formError || error) && <Alert variant="error" title="Transfer failed">{formError || error}</Alert>}

          {success && (
            <div className="wv7-transfer-confirmation" aria-label="Transfer confirmation">
              <Badge variant="success" size="sm"><IconCheck width={12} height={12} /> Confirmed on-chain</Badge>
              <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                View transaction ↗
              </a>
            </div>
          )}

          <div className="wv7-transfer-progress" aria-live="polite">
            <Button variant="primary" block loading={loading} onClick={handleTransfer} disabled={loading || !signer || submitted}>
              {submitted ? '✓ Sent' : 'Send ANV'}
            </Button>
            {!signer && <p className="field-hint" style={{ marginTop: 10, textAlign: 'center' }}>Connect your wallet to send a transfer</p>}
          </div>
        </Panel>
      </Section>

      <Section spacing="md">
        <TransferHistoryTable transfers={transfers} arcExplorer={arcExplorer} />
      </Section>
    </Container>
  )
}
