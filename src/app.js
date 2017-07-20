'use strict'

const KOA = require('koa')
const bodyParser = require('koa-bodyparser')
const { loggerMiddleware } = require('./lib/logger')
const { responseHandler, errorHandler } = require('./lib/response')

const app = new KOA()
const router = require('./routes').prefix('/api')

app.use(loggerMiddleware)
app.use(errorHandler)
app.use(bodyParser)
app.use(router.routes())
app.use(responseHandler)

module.exports = app
