'use strict'
const {logNotify, logSuccess, parseJson} = require('../../utils')

let config
let ENV

try {
    config = parseJson('./scripts/config/config.json', 'utf8')
    logSuccess(`Local key/value pairs for project configuration found successfuly.`)
} catch (err) {
    logNotify(`There are no local secrets available for project configuration, environment variables will be used.`)
}

exports.ENV = () => {
    Object.keys(config).map((key) => {
        ENV[key] = process.env[key] || config[key]
    })
}
