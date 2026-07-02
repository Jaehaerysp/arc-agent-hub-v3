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

// --- eth_getLogs chunking -------------------------------------------------
// Root cause of the "could not coalesce error" on the Jobs Overview page:
// listJobsForAccount() used to call contract.queryFilter(filter) with no
// block range, which defaults to fromBlock=0 -> toBlock='latest'. Arc
// Testnet's RPC (like most public JSON-RPC endpoints) rejects eth_getLogs
// calls whose block span or result size is too large. The rejection isn't
// shaped like a standard JSON-RPC error object, so ethers v6 can't normalize
// it into a specific error and falls back to its generic
// "could not coalesce error" wrapper — which is why the real cause (a
// too-large getLogs range) was showing up as an opaque message instead of
// something actionable.
//
// Fix: never issue an unbounded getLogs call. Walk the chain in bounded
// windows, and if a window still gets rejected (because the RPC's real
// limit is smaller than our starting guess), shrink the window and retry
// the same range instead of failing outright.
const LOG_CHUNK_INITIAL_BLOCKS = 5000n
const LOG_CHUNK_MIN_BLOCKS = 250n

/**
 * Runs contract.queryFilter(filter, fromBlock, toBlock) in bounded windows
 * so a single request never asks the RPC for an unbounded/too-large block
 * range (the condition that was surfacing as "could not coalesce error").
 * Automatically shrinks the window and retries if the RPC still rejects it.
 */
async function queryFilterChunked(contract, filter, fromBlock, toBlock) {
  const results = []
  let chunkSize = LOG_CHUNK_INITIAL_BLOCKS
  let cursor = fromBlock

  while (cursor <= toBlock) {
    const end = cursor + chunkSize - 1n > toBlock ? toBlock : cursor + chunkSize - 1n

    try {
      const logs = await contract.queryFilter(filter, cursor, end)
      results.push(...logs)
      cursor = end + 1n
    } catch (err) {
      if (chunkSize <= LOG_CHUNK_MIN_BLOCKS) {
        // Already at the smallest window we're willing to try — this is a
        // genuine RPC/network failure, not a range-size problem. Surface it.
        throw err
      }
      const halved = chunkSize / 2n
      chunkSize = halved < LOG_CHUNK_MIN_BLOCKS ? LOG_CHUNK_MIN_BLOCKS : halved
      // retry the same `cursor` with the smaller window
    }
  }

  return results
}

// Per-account, per-role log cache so the 20s poll in useJobs only scans new
// blocks instead of re-walking the whole chain (and re-risking a
// too-large-range rejection) on every refresh.
const logScanCache = new Map()

async function getLogsIncremental(contract, filter, provider, cacheKey) {
  const currentBlock = BigInt(await provider.getBlockNumber())
  const cached = logScanCache.get(cacheKey)
  const fromBlock = cached ? cached.lastBlock + 1n : 0n

  let logs = cached ? cached.logs : []
  if (fromBlock <= currentBlock) {
    const newLogs = await queryFilterChunked(contract, filter, fromBlock, currentBlock)
    if (newLogs.length) logs = [...logs, ...newLogs]
  }

  logScanCache.set(cacheKey, { lastBlock: currentBlock, logs })
  return logs
}

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

/** Reads a job by id. Accepts a signer or a plain provider (read-only). */
export async function getJob(signerOrProvider, jobId) {
  const contract = getCommerceContract(signerOrProvider)
  const job = await contract.getJob(jobId)
  return formatJob(job)
}

/**
 * Reads how much USDC the Agentic Commerce contract is currently allowed to
 * pull on `owner`'s behalf — used to decide whether "Approve USDC" or
 * "Fund Job" is the correct next action for a job in the Open status.
 */
export async function getUsdcAllowance(signerOrProvider, owner) {
  const usdc = getUsdcContract(signerOrProvider)
  return usdc.allowance(owner, AGENTIC_COMMERCE_ADDRESS)
}

/**
 * Sprint 2 addition — the verified SDK has no "list jobs" call (only
 * getJob(id)), so job discovery for the Jobs dashboard/history is done by
 * reading JobCreated logs (jobId, client and provider are all indexed) for
 * jobs where the account is client OR provider, then resolving each id with
 * the same verified getJob() above. Read-only; does not touch any write path.
 */
export async function listJobsForAccount(signerOrProvider, account) {
  const contract = getCommerceContract(signerOrProvider)
  const runner = signerOrProvider.provider ?? signerOrProvider
  const normalizedAccount = account.toLowerCase()

  const [asClient, asProvider] = await Promise.all([
    getLogsIncremental(contract, contract.filters.JobCreated(null, account), runner, `client:${normalizedAccount}`),
    getLogsIncremental(contract, contract.filters.JobCreated(null, null, account), runner, `provider:${normalizedAccount}`),
  ])

  const logByJobId = new Map()
  for (const log of [...asClient, ...asProvider]) {
    const jobId = log.args[0].toString()
    if (!logByJobId.has(jobId)) logByJobId.set(jobId, log)
  }

  const entries = [...logByJobId.entries()]

  const uniqueBlocks = [...new Set(entries.map(([, log]) => log.blockNumber))]
  const blockResults = await Promise.allSettled(uniqueBlocks.map((blockNumber) => runner.getBlock(blockNumber)))
  const timestampByBlock = new Map()
  blockResults.forEach((result, i) => {
    const blockNumber = uniqueBlocks[i]
    if (result.status === 'fulfilled' && result.value) {
      timestampByBlock.set(blockNumber, Number(result.value.timestamp) * 1000)
    } else {
      timestampByBlock.set(blockNumber, null)
    }
  })

  const jobResults = await Promise.allSettled(
    entries.map(async ([jobId, log]) => {
      const job = await getJob(signerOrProvider, jobId)
      return { ...job, createdAt: timestampByBlock.get(log.blockNumber) || null, createdTxHash: log.transactionHash }
    })
  )

  const jobs = []
  jobResults.forEach((result) => {
    if (result.status === 'fulfilled') jobs.push(result.value)
  })

  if (jobs.length === 0 && entries.length > 0) {
    // Every single job lookup failed even though logs were found — this is
    // a real failure (not "no jobs exist"), so surface the last underlying
    // reason instead of silently showing an empty list.
    const lastFailure = jobResults.find((r) => r.status === 'rejected')
    throw lastFailure ? lastFailure.reason : new Error('Failed to resolve any job from on-chain logs')
  }

  return jobs.sort((a, b) => Number(b.id) - Number(a.id))
}
