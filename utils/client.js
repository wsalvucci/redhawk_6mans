const Discord = require('discord.js')
const client = new Discord.Client()
const token = require('./botToken')

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag)
})

client.login(token)

module.exports = client