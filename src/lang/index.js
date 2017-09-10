'use strict'

const fs = require('fs')
const path = require('path')
const config = require('../config')

let language = config.language

const languages = {}

const languageFiles = fs.readdirSync(__dirname).filter(langFile => /\.js/.test(langFile) && langFile !== path.basename(__filename))
for (const file of languageFiles) {
  languages[file.substring(0, file.lastIndexOf('.js'))] = require(`./${file}`)
}

module.exports = {
  language,
  setLanguage: lang => {
    language = lang
  },
  LANG: (() => {
    return languages[language]
  })()
}