'use strict'

const emptyResponse = {}
const { logger } = require('./logger')

const responseHandler = (ctx, next) => {
  if (ctx.result !== undefined) {
    ctx.type = 'json'
    ctx.body = {
      success: true,
      data: ctx.result === emptyResponse ? undefined : ctx.result
    }
  }

  return next()
}

const errorHandler = (ctx, next) => {
  return next().catch(err => {
    err = err.error || err

    if (err.code == null && err.status !== 401) {
      logger.error(err.stack)
    }

    ctx.body = {
      success: false,
      code: err.code || -1,
      message: err.message.trim()
    }
  })
}

module.exports = {
  emptyResponse,
  responseHandler,
  errorHandler
}
