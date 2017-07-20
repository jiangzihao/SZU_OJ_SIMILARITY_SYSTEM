'use strict'

const path = require('path')

module.exports = {
  mysql: {
    host: 'localhost',
    database: 'jol'
  },
  log: path.resolve(__dirname, '../../logs/server.log')
}
