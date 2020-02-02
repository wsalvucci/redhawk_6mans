const moment = require('moment')
const sendQuery = require('../utils/sendQuery')
const { lobbies, queuedPlayers, playerList } = require('./data')
const createCasualGame = require('./createCasualGame')

async function getPlayerList(id) {
    await sendQuery('SELECT * FROM players WHERE discord_id = ' + id).then(data => {
        data.forEach(player => {
            if (player['discord_id'] === id)
                alert(player)
        });
        alert(null)
    }, err => {
        console.error('Error while fetching players')
        throw new Error('Error while fetching players')
    })
}

function addNewPlayer(id, name) {
    sendQuery('INSERT INTO players (discord_id, name) VALUES (' + id + ', ' + name + ')').then(data => {
        return true
    }, err => {
        console.error('Error adding player to database')
        return false
    })
}

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

        var playerData = getPlayerList(msg.author.id).then(data => {
            queuePlayerData = data

            // If no player data was returned, create a new data object and add it to the database
            if (data === null) {
                queuePlayerData = {
                    'discord_id': msg.author.id,
                    'name': msg.author.username,
                    'mmr': 1500
                }
                addNewPlayer(queuePlayerData['discord_id'], queuePlayerData['name'])
            }

            // Push the player object to the queue
            queuedPlayers.push(queuePlayerData)
            msg.reply('You\'ve been added to the queue!').then(reply => {
                setTimeout(() => {
                    reply.delete().catch(err => console.error(err))
                }, 5000);
            }).catch(err => console.error(err))
            msg.delete().catch(err => console.error(err)) // Delete the command messages

            // If at least 6 players are now in the queue, run the lobby
            if (queuedPlayers.length >= 6) {
                createCasualGame(queuedPlayers)
                queuedPlayers.splice(6)
            }
        }, err => {

        })
    }
}