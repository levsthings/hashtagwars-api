'use strict'
const R = require('ramda')
const WebSocket = require('ws')
const {stream} = require('./streams')
const {client} = require('./vendor/twitter')
const {validateMessage} = require('./validateMessage')

const wss = new WebSocket.Server({ port: 8080 })

// TODO: Block multiple connections
wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        const isValid = validateMessage(msg)
        if (!isValid) {
            ws.send('Invalid request')
            throw new Error('Invalid message from client')
            // TODO: Close connection
        } else {
            const {tags} = isValid
            let trackedData = R.fromPairs(R.map(key => [key, 0], tags))

            tags.map((hashtag) => {
                const hashtagStream = stream(client, hashtag)

                hashtagStream.on('data', (event) => {
                    trackedData = R.evolve({[hashtag]: R.inc}, trackedData)
                    ws.send(JSON.stringify(trackedData))
                })

                hashtagStream.on('error', (error) => {
                    // TODO: Send an error object
                    throw error
                })
            })
        }
    })
})
