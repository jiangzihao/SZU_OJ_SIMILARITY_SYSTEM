'use strict'

const fs = require('fs')
const pad = require('pad-left')
const path = require('path')
const config = require('config')
const log4js = require('log4js')

const logsDir = path.parse(config.log).dir
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'dateFile', filename: config.log, pattern: '-yyyy-MM-dd' }
  ]
})

const logger = log4js.getDefaultLogger()

const loggerMiddleware = async (ctx, next) => {
  const start = new Date()
  await next()

  const ms = new Date() - start
  const remoteAddr = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))

  logger.info(`${pad(ctx.method, 6)} ${ctx.status} ${ctx.url} - ${remoteAddr} - ${ms}ms`)
}

module.exports = {
  logger,
  loggerMiddleware
}
