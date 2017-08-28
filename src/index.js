'use strict'
const WebSocket = require('ws')
const {stream} = require('./streams')
const {client} = require('./vendor/twitter')

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

    secondStream.on('data', event => ws.send(`#TuesdayMotivation: ${scores.second++}`))
    secondStream.on('error', (error) => {
        throw error
    })
})
