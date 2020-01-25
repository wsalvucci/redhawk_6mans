const moment = require('moment')
const { lobbies, queuedPlayers } = require('./data')
const createCasualGame = require('./createCasualGame')

module.exports = (msg) => {
    var alreadyIn = false
    queuedPlayers.forEach(player => {
        if (player['discordId'] == msg.author.id){
            msg.reply('You\'re already in the queue!').catch(err => console.error(err))
            alreadyIn = true
        }
    });
    if (!alreadyIn) {
        var newPlayer = {
            'enterTime': moment.unix(),
            'name': msg.author.username,
            'discordId': msg.author.id,
            'mmr': 1500
        }
        queuedPlayers.push(newPlayer)
        msg.reply('You\'ve been added to the queue!').catch(err => console.error(err))
    }
    if (queuedPlayers.length >= 6) {
        createCasualGame(queuedPlayers)
        queuedPlayers.splice(6)
    }
}