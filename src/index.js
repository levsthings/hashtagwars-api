'use strict'
const WebSocket = require('ws')
const {stream} = require('./streams')
const {client} = require('./vendor/twitter')
const {validateMessage} = require('./validateMessage')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        const isValid = validateMessage(msg)
        if (!isValid) {
            ws.send('Invalid request')
            throw new Error('Invalid message from client')
            // TODO: Close connection
        } else {
            isValid.tags.map((hashtag) => {
                let score = 0
                const hashtagStream = stream(client, hashtag)

                hashtagStream.on('data', event => ws.send(`${hashtag}: ${score++}`))
                hashtagStream.on('error', (error) => {
                    throw error
                })
            })
        }
    })
})
