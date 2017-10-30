'use strict'
const express = require('express')
const R = require('ramda')
const WebSocket = require('ws')
const {client} = require('./vendor/twitter')
const {logError, logNotify} = require('../utils/')
const {stream} = require('./streams')
const {validateMessage} = require('./validateMessage')

const PORT = process.env.PORT || 3001

const server = express().listen(PORT, () => logNotify(`Listening at ${PORT}`))

const wss = new WebSocket.Server({server})

wss.on('connection', (ws) => {
    logNotify('Connection opened')
    ws.on('message', (msg) => {
        const isValid = validateMessage(msg)

        if (!isValid) {
            logError('Invalid message, terminating connection')
            ws.close(1002)
        } else {
            const {tags} = isValid
            let trackedData = R.fromPairs(R.map(key => [key, 0], tags))

            tags.forEach((hashtag) => {
                const hashtagStream = stream(client, hashtag)

                hashtagStream.on('data', (event) => {
                    trackedData = R.evolve({[hashtag]: R.inc}, trackedData)
                    ws.send(JSON.stringify(trackedData))
                })

                hashtagStream.on('error', () => {
                    hashtagStream.destroy()
                    ws.close(1001)
                })

                ws.on('close', () => {
                    hashtagStream.destroy()
                })
            })

            ws.on('close', () => {
                logNotify('Connection closed')
            })
            ws.on('error', (error) => {
                logError(error)
                ws.close(1000)
            })
        }
    })
})
