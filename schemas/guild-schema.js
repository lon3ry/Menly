const { Schema, model } = require('mongoose');

const GuildSchema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true,
        default: '!'
    },
    language: {
        type: String,
        required: true,
        default: 'english'
    },
    afkChannel: {
        type: String,
        required: true,
    },
    muteRole: {
        type: String,
        required: true,
        default: 'undefined'
    },
    commandChannel: {
        type: String,
        required: true,
        default: 'undefined'
    },
    commands: {
        type:  Object,
        required: true,
        default: {createCustomRole: {
            status: false,
            price: 5000
        }}
    }
});

module.exports = model('guilds', GuildSchema);