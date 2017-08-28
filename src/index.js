const Twitter = require('twitter')
const {ENV} = require('../scripts/config/config')
const {stream} = require('./streams')
const WebSocket = require('ws')

const {
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
} = ENV

const client = new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
})

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
    const scores = {
        first: 0,
        second: 0
    }
    const firstStream = stream(client, '#MondayMotivation')
    const secondStream = stream(client, '#Trump')
    firstStream.on('data', event => ws.send(`#MondayMotivation: ${scores.first++}`))
    firstStream.on('error', (error) => {
        throw error
    })
    secondStream.on('data', event => ws.send(`#Trump: ${scores.second++}`))
    secondStream.on('error', (error) => {
        throw error
    })
})
