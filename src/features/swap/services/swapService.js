// Universal Token Swap (Sprint 4) — swap execution service.
//
// This is the reusable React service the brief asks for, built from the
// two reference CLI scripts (`swap-usdc-eurc.ts` / `swap-eurc-usdc.ts`).
// Both scripts already do the real work — `new AppKit()`, then
// `kit.swap({ from: { adapter, chain }, tokenIn, tokenOut, amountIn,
// config: { kitKey } })` — and that call is carried over UNCHANGED here.
//
// The one thing that could not be ported as-is: the reference scripts
// build their adapter with `createViemAdapterFromPrivateKey({ privateKey
// })`, reading a raw private key out of `.env`. Every other write in this
// app (Bridge's `depositForBurn`, Payments' `transfer`, Transfer's ANV
// send) explicitly signs through the connected browser wallet's
// `signer`/`provider` and NEVER touches a private key — see
// `useWallet.js` and the "No private keys anywhere in this flow" comments
// on BridgePage.jsx/PaymentsPage.jsx. Porting the private-key adapter
// as-is would be the one architectural rule this sprint cannot break.
//
// Circle's own App Kit ships exactly the adapter this app needs for that:
// `createViemAdapterFromProvider({ provider })` (from the same
// `@circle-fin/adapter-viem-v2` package the reference scripts already
// import), built from an EIP-1193 provider instead of a private key. This
// app already holds that provider — it's `window.ethereum`, the same
// object `useWallet.js` calls `window.ethereum.request(...)` on today.
// This is also Circle/Arc's own documented pattern for browser wallets
// (see the Arc Docs "Quickstart: Bridge tokens across blockchains" browser
// wallet flow, which adapts App Kit with `createViemAdapterFromProvider`
// instead of a private key). Nothing about `kit.swap()`'s call shape,
// params, or result changes — only how the adapter signing it is built.
//
// A second unavoidable difference: `kit.swap()` requires a Circle "kit
// key" (`config.kitKey`, from the Circle Console) to authenticate the
// swap request — this is a real requirement of the SDK, not something
// this app invented (see the "Get a pre-swap estimate" / swap quickstart
// docs). Circle's own docs mark it as a credential ("do not embed it in
// client-side source"). This app is a pure Vite/React frontend with no
// backend of its own to proxy the call through, so — same testnet-only
// tradeoff the reference `.env`-based scripts already made — the key is
// read from a build-time env var (`VITE_SWAP_KIT_KEY`, see `.env.example`)
// instead of hardcoded. For a production deployment, proxy `kit.swap()`/
// `kit.estimateSwap()` through a backend so the kit key never ships in the
// client bundle; that's a deployment concern outside this sprint's scope
// (matching how Bridge/Payments never invent server infrastructure that
// doesn't already exist in this repo).

// Not migrated to RpcManager: `kit.swap()` signs and broadcasts through
// the Circle App Kit adapter built from `window.ethereum` (the connected
// wallet), never through a plain RPC URL — so there is no read-only RPC
// call here for RpcManager to front. This is intentional, not an
// oversight; see the RPC migration report for the full read/write split.
import { AppKit } from '@circle-fin/app-kit'
import { createViemAdapterFromProvider } from '@circle-fin/adapter-viem-v2'
import logger from '../../../utils/logger'
import { USDC_TOKEN } from '../../payments/services/usdcPaymentService'
import { WALLET_TOKENS } from '../../wallet/services/tokenRegistry'

// Same single, module-level `AppKit` instance the reference scripts create
// once (`const kit = new AppKit();`) and reuse across every swap call.
const kit = new AppKit()

const EURC_TOKEN = WALLET_TOKENS.find((t) => t.key === 'eurc')

/**
 * Every asset the Swap page can offer (USDC + EURC on Arc Testnet only,
 * per the Sprint 4 brief). Same "thin filter over the registries the app
 * already has" pattern as Bridge's `BRIDGE_ASSETS` — not a new token
 * registry, just the two Circle-issued stablecoins both reference scripts
 * actually swap between.
 */
export const SWAP_TOKENS = [USDC_TOKEN, EURC_TOKEN].filter(Boolean)

export function getSwapToken(key) {
  return SWAP_TOKENS.find((t) => t.key === key) || SWAP_TOKENS[0]
}

/** The other supported token — this feature only ever offers a two-token pair, so "the other one" is always unambiguous. */
export function getOppositeSwapToken(key) {
  return SWAP_TOKENS.find((t) => t.key !== key) || SWAP_TOKENS[0]
}

/** Circle App Kit chain identifier for Arc Testnet, used by every `kit.swap()`/`kit.estimateSwap()` call this feature makes. */
export const SWAP_CHAIN = 'Arc_Testnet'

/**
 * Reads the App Kit "kit key" from the client build. `VITE_CIRCLE_KIT_KEY`
 * is the shared Circle configuration var (any future Circle App Kit
 * feature in this app — swap, bridge, earn — reads from the same name);
 * `VITE_SWAP_KIT_KEY` is still honored as a fallback so an existing
 * deployment's `.env` keeps working unchanged. Never throws, never logs
 * the value — see the module doc comment above for why this is a
 * build-time env var rather than a hardcoded secret.
 */
export function getSwapKitKey() {
  return import.meta.env.VITE_CIRCLE_KIT_KEY || import.meta.env.VITE_SWAP_KIT_KEY || null
}

let cachedAdapter = null
let cachedAdapterProvider = null

/**
 * Builds (and caches) the App Kit adapter for the connected browser
 * wallet. `window.ethereum` is the same EIP-1193 provider `useWallet.js`
 * already drives — never a private key. Re-creates the adapter if the
 * injected provider instance itself changes (e.g. a different wallet
 * extension took over `window.ethereum`).
 */
export async function getSwapAdapter() {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected. Install MetaMask or Rabby to continue.')
  }

  if (cachedAdapter && cachedAdapterProvider === window.ethereum) {
    return cachedAdapter
  }

  cachedAdapter = await createViemAdapterFromProvider({ provider: window.ethereum })
  cachedAdapterProvider = window.ethereum
  return cachedAdapter
}

function buildSwapConfig({ slippageBps }) {
  const kitKey = getSwapKitKey()
  if (!kitKey) {
    throw new Error('KIT_KEY missing — set VITE_CIRCLE_KIT_KEY (or VITE_SWAP_KIT_KEY) in your .env')
  }
  return {
    kitKey,
    ...(slippageBps ? { slippageBps } : {}),
  }
}

/**
 * Executes a same-chain swap between `tokenIn`/`tokenOut` (both from
 * `SWAP_TOKENS`) on Arc Testnet, through the connected browser wallet.
 * Never throws — same convention as `bridgeService.js`/
 * `usdcPaymentService.js`: a failure resolves to `{ error }` so the UI can
 * render it inline instead of an unhandled rejection.
 */
export async function executeSwap({ account, tokenIn, tokenOut, amountIn, slippageBps }) {
  if (!account) {
    return { error: 'Connect your wallet to continue' }
  }

  if (tokenIn.key === tokenOut.key) {
    return { error: 'Token In and Token Out must be different' }
  }

  if (!amountIn || Number(amountIn) <= 0) {
    return { error: 'Invalid amount' }
  }

  try {
    const config = buildSwapConfig({ slippageBps })
    const adapter = await getSwapAdapter()

    const result = await kit.swap({
      from: { adapter, chain: SWAP_CHAIN },
      tokenIn: tokenIn.symbol,
      tokenOut: tokenOut.symbol,
      amountIn,
      config,
    })

    logger.log('Swap completed', {
      tokenIn: tokenIn.symbol,
      tokenOut: tokenOut.symbol,
      amountIn,
      amountOut: result.amountOut ?? null,
      txHash: result.txHash,
      explorerUrl: result.explorerUrl,
      status: result.progress?.status ?? 'DONE',
    })

    return {
      txHash: result.txHash,
      explorerUrl: result.explorerUrl,
      amountOut: result.amountOut ?? null,
      fees: result.fees ?? [],
      status: result.progress?.status ?? 'DONE',
      error: null,
    }
  } catch (e) {
    logger.error('Swap failed', {
      tokenIn: tokenIn.symbol,
      tokenOut: tokenOut.symbol,
      amountIn,
      message: e?.reason || e?.shortMessage || e?.message || 'Swap transaction failed',
    })
    return {
      error: e?.reason || e?.shortMessage || e?.message || 'Swap transaction failed',
    }
  }
}
