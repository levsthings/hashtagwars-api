'use strict'
const R = require('ramda')
const WebSocket = require('ws')
const {logError, logNotify} = require('../scripts/utils/')
const {stream} = require('./streams')
const {client} = require('./vendor/twitter')
const {validateMessage} = require('./validateMessage')

const wss = new WebSocket.Server({ port: 8081 })

wss.on('connection', (ws) => {
    logNotify('Connection opened')
    ws.on('message', (msg) => {
        const isValid = validateMessage(msg)

        if (!isValid) {
            ws.terminate()
        } else {
            const {tags} = isValid
            let trackedData = R.fromPairs(R.map(key => [key, 0], tags))

            tags.map((hashtag) => {
                const hashtagStream = stream(client, hashtag)

                hashtagStream.on('data', (event) => {
                    trackedData = R.evolve({[hashtag]: R.inc}, trackedData)
                    ws.send(JSON.stringify(trackedData))
                })

                hashtagStream.on('error', () => {
                    hashtagStream.destroy()
                    ws.terminate()
                })
            })

            ws.on('close', () => {
                logNotify('Connection closed')
            })
            ws.on('error', (error) => {
                logError(error)
                ws.terminate()
            })
        }
    })
})
