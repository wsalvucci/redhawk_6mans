const { queuedPlayers } = require('./data')

module.exports = (msg) => {
    var notIn = true
    var pos = -1
    queuedPlayers.forEach((player, index) => {
        if (player['discordId'] == msg.author.id) {
            notIn = false
            pos = index
        }
    })
    if (!notIn) {
        queuedPlayers.splice(pos, 1)
        msg.reply('You have been removed from the queue.')
    } else {
        msg.reply('You aren\'t in the queue!').catch(err => console.error(err))
    }
}