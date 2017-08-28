'use strict'
exports.validateMessage = (msg) => {
    let parse

    try {
        parse = JSON.parse(msg)
    } catch (err) {
        console.error(err)
        return false
    }

    const isValid = typeof parse.tags === 'object' && parse.tags.length === 2

    if (!isValid) {
        return false
    } else {
        return parse
    }
}
