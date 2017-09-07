'use strict'
exports.validateMessage = (msg) => {
    let parse

    try {
        parse = JSON.parse(msg)
    } catch (err) {
        return false
    }

    const isValidStructure = obj => (typeof obj.tags === 'object') && (obj.tags.length === 2)
    const areValidTags = arr => arr
        .map(i => (typeof i === 'string') && (i.length >= 2))
        .filter(() => true)

    if (isValidStructure(parse) && (areValidTags(parse.tags).length === 2)) {
        return parse
    } else {
        return false
    }
}
