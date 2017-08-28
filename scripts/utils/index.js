'use strict'
/* eslint no-console: off */
const fs = require('fs')
const chalk = require('chalk')

exports.parseJson = (source, encoding) => JSON.parse((fs.readFileSync(source, encoding)))
exports.log = console.log
exports.logError = message => console.log(chalk.red(`Error: ${message}\n`))
exports.logSuccess = message => console.log(chalk.green(`Success: ${message}\n`))
exports.logNotify = message => console.log(chalk.yellow(`Notification: ${message}\n`))
