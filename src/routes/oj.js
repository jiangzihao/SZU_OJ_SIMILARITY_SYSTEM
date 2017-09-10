'use strict'

const oj = require('../lib/oj')
const Route = require('koa-router')
const { compare } = require('../lib/util')
const { LANG: { ERR } } = require('../lang')
const { InvalidUserInputError } = require('../lib/errors')

const router = new Route()

const transfromInteger = (num, messageIfErr) => {
  num = Number.parseInt(num)
  if (!Number.isSafeInteger(num)) throw new InvalidUserInputError(messageIfErr)
  return num
}

router.get('contests', async (ctx, next) => {
  ctx.result = await oj.getContests()
  return next()
})

router.get('contest/:id', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.CONTEST_ID.INVALID)
  ctx.result = await oj.getContest(id)
  return next()
})

router.get('contest/:id/problems', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.CONTEST_ID.INVALID)
  ctx.result = await oj.getContestProblems()
  return next()
})

router.get('contest/:id/solutions', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.CONTEST_ID.INVALID)
  ctx.result = await oj.getContestSolution(id)
  return next()
})

router.get('problems', async (ctx, next) => {
  ctx.result = await oj.getProblems()
  return next()
})

router.get('problem/:id', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.PROBLEM_ID.INVALID)
  ctx.result = await oj.getProblem(id)
  return next()
})

router.get('problem/:id/contests', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.PROBLEM_ID.INVALID)
  ctx.result = await oj.getProblemContests(id)
  return next()
})

router.get('problem/:id/solutions', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.PROBLEM_ID.INVALID)
  ctx.result = await oj.getProblemSolutions(id)
  return next()
})

router.get('solution/:id', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.SOLUTION_ID.INVALID)
  ctx.result = await oj.getSolution(id)
  return next()
})

router.get('source/:id', async (ctx, next) => {
  let id = transfromInteger(ctx.params.id, ERR.SOLUTION_ID.INVALID)
  ctx.result = await oj.getSource(id)
  return next()
})

router.get('contest/:cid/problem/:pid/solutions', async (ctx, next) => {
  let cid = transfromInteger(ctx.params.cid, ERR.CONTEST_ID.INVALID)
  let pid = transfromInteger(ctx.params.pid, ERR.PROBLEM_ID.INVALID)
  ctx.result = await oj.getContestProblemSolutions(cid, pid)
  return next()
})

router.get('check', async (ctx, next) => {
  ctx.result = await oj.checkSimilarity()
  return next()
})

module.exports = router
