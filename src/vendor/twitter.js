'use strict'
const Twitter = require('twitter')
const {ENV} = require('../../scripts/config/config')

const {
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
} = ENV

exports.client = new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
})
