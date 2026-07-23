// ERC-8183 job service — thin, framework-agnostic wrappers around the
// verified Agentic Commerce contract calls (createJob, setBudget, fund,
// submit, complete, getJob).
//
// Adapted from the ERC-8183 SDK's scripts/*.ts for use inside the React app:
//   - The SDK's scripts sign with raw private keys loaded from a .env file
//     (a Node-only, server-side pattern). That is intentionally NOT carried
//     over — a browser app must never hold a private key. Every write here
//     takes a `signer`, which in the UI is the connected wallet's
//     ethers.Signer from useWallet()/useWalletContext(), the same object
//     AgentsPage, ReputationPage, ValidationPage and TransferPage already use.
//   - The SDK's storage.ts persisted the last job id to a local job.json
//     file. That's replaced by simply passing/reading jobId as a normal
//     value (route param, form state, or the app's existing
//     useLocalStorage hook) — there is no filesystem in the browser.
//   - Contract addresses, ABI signatures and call arguments are otherwise
//     unchanged from the tested scripts.
//
// These functions return the raw ethers TransactionResponse/receipt, mirroring
// useContractWrite's `execute()` return shape ({ txHash, receipt }), so a
// future Sprint-2 hook can wrap them exactly like the ERC-8004 pages do.

import { getCommerceContract, getUsdcContract } from './contracts'
import { AGENTIC_COMMERCE_ADDRESS, DEFAULT_JOB_EXPIRY_SECONDS, ZERO_ADDRESS } from './constants'
import { hashText, formatJob } from './helpers'
import { getReadProvider } from '../rpc/ethersAdapter'

// Reads in this file (getJob / getUsdcAllowance / listJobsForAccount) used
// to hand-roll their own rate-limit retry here because they all went
// through the single shared public Arc RPC, which enforces a request-rate
// limit that eth_getLogs/eth_call bursts could trip. That retry loop is
// gone now — RpcManager (src/lib/rpc/RpcManager.ts) already retries with
// exponential backoff, rate-limits per provider, and fails over to the
// next of four providers, so every read below goes through
// `getReadProvider()` instead of the hand-rolled loop.

// Terminal job statuses never change on-chain again, so once a job resolves
// to one of these there is no need to re-fetch it on every poll tick — that
// alone removes most of the repeated getJob() calls that add to RPC load.
const TERMINAL_STATUSES = new Set([3, 4, 5]) // Completed, Rejected, Expired
const jobCache = new Map() // jobId -> formatted job (only terminal-status entries are kept)

async function sendAndWait(tx) {
  const receipt = await tx.wait()
  return { txHash: tx.hash, receipt }
}

/** Creates a new job. `expiredAt` defaults to now + 1 hour, matching the verified script. */
export async function createJob(signer, { provider, evaluator = ZERO_ADDRESS, description, hook = ZERO_ADDRESS, expiredAt } = {}) {
  const contract = getCommerceContract(signer)

  let expiry = expiredAt
  if (!expiry) {
    const block = await signer.provider.getBlock('latest')
    if (!block) throw new Error('Unable to fetch latest block')
    expiry = BigInt(block.timestamp) + DEFAULT_JOB_EXPIRY_SECONDS
  }

  const tx = await contract.createJob(provider, evaluator, expiry, description, hook)
  const { txHash, receipt } = await sendAndWait(tx)

  const event = receipt.logs
    .map((log) => {
      try {
        return contract.interface.parseLog(log)
      } catch {
        return null
      }
    })
    .find((parsed) => parsed?.name === 'JobCreated')

  const jobId = event ? event.args[0].toString() : null

  return { txHash, receipt, jobId }
}

/** Sets the budget for a job (called by the provider side). */
export async function setBudget(signer, jobId, amount) {
  const contract = getCommerceContract(signer)
  const tx = await contract.setBudget(jobId, amount, '0x')
  return sendAndWait(tx)
}

/** Approves the Agentic Commerce contract to pull `amount` of USDC on the client's behalf. */
export async function approveUsdc(signer, amount) {
  const usdc = getUsdcContract(signer)
  const tx = await usdc.approve(AGENTIC_COMMERCE_ADDRESS, amount)
  return sendAndWait(tx)
}

/** Funds a job (requires prior USDC approval). */
export async function fundJob(signer, jobId) {
  const contract = getCommerceContract(signer)
  const tx = await contract.fund(jobId, '0x')
  return sendAndWait(tx)
}

/** Submits a deliverable for a job. `deliverableText` is hashed with keccak256 before sending. */
export async function submitDeliverable(signer, jobId, deliverableText) {
  const contract = getCommerceContract(signer)
  const deliverableHash = hashText(deliverableText)
  const tx = await contract.submit(jobId, deliverableHash, '0x')
  const result = await sendAndWait(tx)
  return { ...result, deliverableHash }
}

/** Completes (approves) a job. `reasonText` is hashed with keccak256 before sending. */
export async function completeJob(signer, jobId, reasonText) {
  const contract = getCommerceContract(signer)
  const reasonHash = hashText(reasonText)
  const tx = await contract.complete(jobId, reasonHash, '0x')
  const result = await sendAndWait(tx)
  return { ...result, reasonHash }
}

/**
 * Reads a job by id. `signerOrProvider` is accepted for backwards
 * compatibility with existing call sites but is no longer used for the
 * actual read — getJob() is a pure view call, so it always goes through
 * RpcManager's resilient provider instead, regardless of what's passed.
 */
export async function getJob(_signerOrProvider, jobId) {
  const contract = getCommerceContract(getReadProvider())
  const job = await contract.getJob(jobId)
  return formatJob(job)
}

/**
 * Reads how much USDC the Agentic Commerce contract is currently allowed to
 * pull on `owner`'s behalf — used to decide whether "Approve USDC" or
 * "Fund Job" is the correct next action for a job in the Open status.
 */
export async function getUsdcAllowance(_signerOrProvider, owner) {
  const usdc = getUsdcContract(getReadProvider())
  return usdc.allowance(owner, AGENTIC_COMMERCE_ADDRESS)
}

/**
 * Sprint 2 addition — the verified SDK has no "list jobs" call (only
 * getJob(id)), so job discovery for the Jobs dashboard/history is done by
 * reading JobCreated logs (jobId, client and provider are all indexed) for
 * jobs where the account is client OR provider, then resolving each id with
 * the same verified getJob() above. Read-only; does not touch any write path.
 */
export async function listJobsForAccount(_signerOrProvider, account) {
  const readProvider = getReadProvider()
  const contract = getCommerceContract(readProvider)

  const latest = await readProvider.getBlockNumber()

  // Arc RPC allows max 10,000 blocks per request
  const fromBlock = Math.max(0, latest - 10000)

  // Still run sequentially rather than Promise.all — RpcManager rate-limits
  // per provider, but a tiny gap between these two eth_getLogs calls is
  // cheap insurance and avoids burning through the token bucket in one tick.
  const clientLogs = await contract.queryFilter(contract.filters.JobCreated(null, account), fromBlock, latest)
  const providerLogs = await contract.queryFilter(
    contract.filters.JobCreated(null, null, account),
    fromBlock,
    latest
  )

  const map = new Map()

  for (const log of [...clientLogs, ...providerLogs]) {
    const id = log.args[0].toString()

    if (!map.has(id)) {
      map.set(id, log)
    }
  }

  const jobs = []

  for (const [jobId, log] of map) {
    try {
      // Terminal-status jobs (Completed/Rejected/Expired) can't change
      // on-chain again, so skip re-fetching them every poll tick — this is
      // usually most of the reduction in RPC calls once a wallet has any
      // job history.
      const cached = jobCache.get(jobId)
      const job = cached ?? (await getJob(null, jobId))

      if (!cached && TERMINAL_STATUSES.has(job.status)) {
        jobCache.set(jobId, job)
      }

      jobs.push({
        ...job,
        createdTxHash: log.transactionHash,
        createdAt: null,
      })
    } catch (err) {
      console.error("Failed Job", jobId, err)
    }
  }

  jobs.sort((a, b) => Number(b.id) - Number(a.id))

  return jobs
}
