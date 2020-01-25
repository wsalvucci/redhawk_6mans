const moment = require('moment')
const { lobbies, queuedPlayers, playerList } = require('./data')
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
        var playerMmr = 1500 // Defaults to mmr of 1500 if it's a new player
        var knownPlayer = false // Flag for if this is a player not registered

        // Temporary function which will be replaced by database call in future
        playerList.forEach(player => {
            if (player['discordId'] === msg.author.id) {
                playerMmr = player['mmr']
                knownPlayer = true
            }
        });

        // Create player object to add to queue
        var newPlayer = {
            'enterTime': moment.unix(),
            'name': msg.author.username,
            'discordId': msg.author.id,
            'mmr': playerMmr
        }

        // Add player object to queue
        queuedPlayers.push(newPlayer)
        msg.reply('You\'ve been added to the queue!').then(reply => {
            setTimeout(() => {
                reply.delete().catch(err => console.error(err))
            }, 5000);
        }).catch(err => console.error(err))
        msg.delete().catch(err => console.error(err))
    }
    if (queuedPlayers.length >= 6) {
        createCasualGame(queuedPlayers)
        queuedPlayers.splice(6)
    }
}