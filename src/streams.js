exports.stream = (client, track) => client.stream('statuses/filter', {track, stall_warnings: true})
