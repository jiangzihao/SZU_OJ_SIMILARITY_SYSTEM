'use strict'

const path = require('path')

module.exports = {
  mysql: {
    conn: {
      host: 'localhost',
      database: 'jol',
      user: '',
      password: '',
      connectionLimit: 10
    },
    tables: {
      sim: 'sim',
      user: 'user',
      privilege: 'privilege',
      problem: 'problem',
      solution: 'solution_copy',
      contest_problem: 'contest_problem',
      contest: 'contest',
      compileinfo: 'compileinfo',
      source_code: 'source_code_copy'
    }
  },
  port: 3010,
  log: path.resolve(__dirname, '../../logs/server.log'),
  language: 'en'
}
