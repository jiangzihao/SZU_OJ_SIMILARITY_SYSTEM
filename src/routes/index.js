'use strict'

const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

const router = new Router()

// 读取除了自己以外的所有路由
const routes = fs.readdirSync(__dirname).filter(route => /\.js$/.test(route) && route !== path.basename(__filename))
for (const route of routes) {
  router.use(require(`./${route}`).routes())
}

module.exports = router
