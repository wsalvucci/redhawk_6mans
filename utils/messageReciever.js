const client = require('./client')

const { listLobbies, enterQueue, showQueue, leaveQueue } = require('../lobbies/commandList')

client.on('message', msg => {
    if (msg.content.startsWith('?')) {
        var command = msg.content.substr(1).toLowerCase()
        switch(command) {
            case 'list':
                listLobbies(msg)
                break
            case 'enterqueue':
            case 'eq':
                enterQueue(msg)
                break
            case 'showqueue':
            case 'sq':
                showQueue(msg)
                break
            case 'leavequeue':
            case 'lq':
                leaveQueue(msg)
                break
        }
    }
})