// Structured server logger.
//
// Same call shape as the client's src/utils/logger.js (log/info/warn/error)
// so both halves of the app follow one logging convention — but this can't
// literally import that file, since it gates on `import.meta.env.DEV`
// (a Vite build-time global that doesn't exist under Node/Express).
// This gates on `NODE_ENV` instead, the Node equivalent.
//
// Every log line is a single structured JSON object (timestamp, level,
// message, context) rather than freeform strings — deliberately not
// `console.log(...)` at the call sites, per the brief's logging rule.

const isProd = process.env.NODE_ENV === 'production'

function write(level, message, context) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  }

  // In production, still emit structured JSON (useful for log aggregators)
  // but keep it to warn/error only; info/debug stay dev-only, same
  // "quiet in prod" intent as the client logger.
  if (level === 'error' || level === 'warn') {
    process.stderr.write(JSON.stringify(entry) + '\n')
    return
  }

  if (!isProd) {
    process.stdout.write(JSON.stringify(entry) + '\n')
  }
}

export const logger = {
  log: (message, context) => write('info', message, context),
  info: (message, context) => write('info', message, context),
  warn: (message, context) => write('warn', message, context),
  error: (message, context) => write('error', message, context),
}

export default logger
