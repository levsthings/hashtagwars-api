'use strict'
exports.validateMessage = (msg) => {
    let parsed

    try {
        parsed = JSON.parse(msg)
    } catch (err) {
        return false
    }

    const isValidStructure = obj => (typeof obj.tags === 'object') && (obj.tags.length === 2)
    const areValidTags = arr => arr
        .map(i => (typeof i === 'string') && (i.length >= 2))
        .filter(() => true)

    if (isValidStructure(parsed) && (areValidTags(parsed.tags).length === 2)) {
        return parsed
    } else {
        return false
    }
}
