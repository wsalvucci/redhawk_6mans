const { queuedPlayers } = require('./data')

module.exports = (msg) => {
    playerFields = []
    queuedPlayers.forEach(player => {
        playerFields.push({
            name: player['name'],
            value: player['mmr'],
            inline: true
        })
    });
    msg.channel.send({embed: {
        color: 0xff0000,
        title: 'Players In Queue: ' + queuedPlayers.length,
        fields: playerFields,
        timestamp: new Date()
    }}).catch(err => console.error(err))
}