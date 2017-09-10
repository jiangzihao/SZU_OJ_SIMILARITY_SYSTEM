'use strict'

const stringSimilarity = require('string-similarity')

const compare = (str1, str2) => {
  return stringSimilarity.compareTwoStrings(str1, str2)
}

module.exports = {
  compare
}