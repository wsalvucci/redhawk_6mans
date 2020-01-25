const Discord = require('discord.js')
const client = require('../utils/client')
const moment = require('moment')
const { games } = require('./data')

queueingLobbyId = '669677759773016074'
notificationChannelId = '669678380563824640'
guildId = '487359838213636111'
categoryId = '669684488384544798'

function getTeamTotalMMR(playerList) {
    var totalMMR = 0
    playerList.forEach(player => {
        totalMMR += player['mmr']
    });
    return totalMMR
}


module.exports = (queue) => {
    const guild = client.guilds.get(guildId)
    const queueLobby = client.channels.get(queueingLobbyId)
    const statusChannel = client.channels.get(notificationChannelId)
    const channelCategory = client.channels.get(categoryId)

    if (queue.length < 6) {
        console.error('Invalid queue size given to casual game starter')
        return
    } else {
        var matchId = Math.floor(Math.random() * 10000)
        //Generates a random number between 10000 and 99999
        var matchPassword = Math.floor(10000 + (Math.random() * 89999))

        var orangeTeam = []
        var blueTeam = []
        var addToOrange = true
        var orangeTeamMembers = ''
        var blueTeamMembers = ''

        // Sort players by MMR from highest to lowest
        queue.sort((a, b) => a['mmr'] - b['mmr'])

        for (var i = 0; i < 6; i++) {
            // Send the highest rated player to the team with the lowest total MMR
            if (totalMMR(orangeTeam) >= totalMMR(blueTeam)) {
                blueTeam.push(nextPlayer)
                blueTeamMembers = blueTeamMembers + nextPlayer['name'] + ' '
            } else {
                orangeTeam.push(nextPlayer)
                orangeTeamMembers = orangeTeamMembers + nextPlayer['name'] + ' '
            }
            var nextPlayer = queue.shift()
        }

        games.push({
            matchId: matchId,
            timeStarted: moment.unix(),
            players: {
                blueTeam: blueTeam,
                orangeTeam: orangeTeam
            }
        })

        const matchupEmbed = new Discord.RichEmbed()
            .setTitle('Game created!')
            .setColor(0xff0000)
            .setTimestamp(new Date())
            .addField('Orange Team', orangeTeamMembers)
            .addField('Blue Team', blueTeamMembers)

        statusChannel.send(matchupEmbed)
        setTimeout(function() {
            var createOrangeVoice = guild.createChannel('6-mans-orange-' + matchId, {type: 'voice'}).catch(err => console.error(err))
            var createBlueVoice = guild.createChannel('6-mans-blue-' + matchId, {type: 'voice'}).catch(err => console.error(err))
            Promise.all([createOrangeVoice, createBlueVoice]).then(channels => {
                var orangeTeamVoiceChat = channels[0]
                var blueTeamVoiceChat = channels[1]

                orangeTeamVoiceChat.setUserLimit(3)
                orangeTeamVoiceChat.setParent(channelCategory)
                blueTeamVoiceChat.setUserLimit(3)
                blueTeamVoiceChat.setParent(channelCategory)

                queueLobby.members.forEach((member, index) => {
                    if (index === 0) {
                        member.createDM().then(dm => {
                            dm.sendMessage('You are the host! Please create a lobby with these properties:')
                            var hostEmbed = new Discord.RichEmbed()
                                .addField('Name', 'Miami' + matchId)
                                .addField('Password', matchPassword)
                            dm.sendMessage(hostEmbed)
                        })
                    } else {
                        member.createDM().then(dm => {
                            dm.sendMessage('Username and Password for your lobby. You may need to wait for the host to create it.')
                            var hostEmbed = new Discord.RichEmbed()
                                .addField('Name', 'Miami' + matchId)
                                .addField('Password', matchPassword)
                            dm.sendMessage(hostEmbed)
                        })
                    }
                    orangeTeam.forEach(player => {
                        if (player['discordId'] == member.id) {
                            member.setVoiceChannel(orangeTeamVoiceChat).catch(err => console.error(err))
                        }
                    });
                    blueTeam.forEach(player => {
                        if (player['discordId'] == member.id) {
                            member.setVoiceChannel(blueTeamVoiceChat).catch(err => console.error(err))
                        }
                    });
                });

                var orangeWatch = setInterval(function() {
                    if (orangeTeamVoiceChat.members.size == 0) {
                        orangeTeamVoiceChat.delete().catch(err => console.error(err))
                        clearInterval(orangeWatch)
                    }
                }, 1000)
                var blueWatch = setInterval(function() {
                    if (blueTeamVoiceChat.members.size == 0) {
                        blueTeamVoiceChat.delete().catch(err => console.error(err))
                        clearInterval(blueWatch)
                    }
                }, 1000)
            }).catch(err => console.error(err))
        }, 10000)
    }
}