'use strict'

const mysql = require('promise-mysql')
const config = require('../config')

const pool = mysql.createPool(config.mysql.conn)

module.exports = {
  getDefaultDb: () => {
    return new Promise((resolve, reject) => {
      const conn = pool.getConnection().then(conn => {
        resolve(conn)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
