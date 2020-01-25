const { lobbies } = require('./data')

module.exports = (msg) => {
    msg.reply(lobbies.length)
}