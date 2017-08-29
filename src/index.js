'use strict'
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
            const data = {
                [tags[0]]: 0,
                [tags[1]]: 0
            }
            tags.map((hashtag) => {
                const hashtagStream = stream(client, hashtag)

                hashtagStream.on('data', (event) => {
                    data[hashtag]++
                    ws.send(JSON.stringify(data))
                })
                hashtagStream.on('error', (error) => {
                    // TODO: Send an error object
                    throw error
                })
            })
        }
    })
})
