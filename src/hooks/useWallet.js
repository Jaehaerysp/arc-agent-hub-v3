import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { ARC_CHAIN_ID, ARC_CHAIN_ID_HEX, ARC_NETWORK_PARAMS, ARC_EXPLORER_URL } from '../chains/arc'
import { useLocalStorage } from './useLocalStorage'

const MAX_ACTIVITY_ENTRIES = 50

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const [agentId, setAgentIdRaw] = useLocalStorage('arc_agent_id', null)
  const [activity, setActivity] = useLocalStorage('arc_activity', [])

  const isArcNetwork = chainId === ARC_CHAIN_ID

  const setAgentId = useCallback(
    (id) => {
      setAgentIdRaw(id ? id.toString() : null)
    },
    [setAgentIdRaw]
  )

  const addActivity = useCallback(
    (entry) => {
      setActivity((prev) => [
        { id: Date.now(), timestamp: new Date().toISOString(), ...entry },
        ...prev.slice(0, MAX_ACTIVITY_ENTRIES - 1),
      ])
    },
    [setActivity]
  )

  const clearActivity = useCallback(() => setActivity([]), [setActivity])

  const clearSession = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setError(null)
  }, [])

  const switchToArc = useCallback(async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_CHAIN_ID_HEX }],
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARC_NETWORK_PARAMS],
          })
        } catch (addError) {
          setError('Failed to add Arc network: ' + addError.message)
        }
      } else {
        setError('Failed to switch network: ' + switchError.message)
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('No wallet extension detected. Install MetaMask or Rabby to continue.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum)
      await browserProvider.send('eth_requestAccounts', [])

      const walletSigner = await browserProvider.getSigner()
      const address = await walletSigner.getAddress()
      const network = await browserProvider.getNetwork()

      setProvider(browserProvider)
      setSigner(walletSigner)
      setAccount(address)
      setChainId(Number(network.chainId))

      if (Number(network.chainId) !== ARC_CHAIN_ID) {
        await switchToArc()
      }
    } catch (e) {
      setError(e?.reason || e?.shortMessage || e?.message || 'Wallet connection failed')
    } finally {
      setIsConnecting(false)
    }
  }, [switchToArc])

  const disconnect = useCallback(() => {
    clearSession()
  }, [clearSession])

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = async (accounts) => {
      if (!accounts || accounts.length === 0) {
        clearSession()
        return
      }

      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        const walletSigner = await browserProvider.getSigner()
        const network = await browserProvider.getNetwork()

        setProvider(browserProvider)
        setSigner(walletSigner)
        setAccount(accounts[0])
        setChainId(Number(network.chainId))
        setError(null)
      } catch {
        setError('Wallet refresh failed')
      }
    }

    const handleChainChanged = async (hexChainId) => {
      try {
        const newChainId = parseInt(hexChainId, 16)
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        const walletSigner = await browserProvider.getSigner()

        setProvider(browserProvider)
        setSigner(walletSigner)
        setChainId(newChainId)
        setError(null)

        addActivity({
          type: 'network',
          label: 'Network switched',
          detail: `Chain changed to ${newChainId}`,
          status: 'success',
        })
      } catch {
        setError('Failed refreshing after network switch')
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [clearSession, addActivity])

  return {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    isArcNetwork,
    agentId,
    setAgentId,
    activity,
    addActivity,
    clearActivity,
    connect,
    disconnect,
    switchToArc,
    arcExplorer: ARC_EXPLORER_URL,
  }
}
