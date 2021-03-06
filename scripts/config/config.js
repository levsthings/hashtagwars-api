'use strict'
const {logNotify, logSuccess, parseJson} = require('../../utils')

let config

try {
    config = parseJson('./scripts/config/config.json', 'utf8')
    logSuccess(
        `Local key/value pairs for project configuration found successfuly.`
    )
} catch (err) {
    logNotify(
        `There are no local key/value pairs for project configuration, environment variables will be used.`
    )
}

exports.ENV = {
    consumer_key: process.env.consumer_key || config.consumer_key,
    consumer_secret: process.env.consumer_secret || config.consumer_secret,
    access_token_key: process.env.access_token_key || config.access_token_key,
    access_token_secret:
        process.env.access_token_secret || config.access_token_secret
}
