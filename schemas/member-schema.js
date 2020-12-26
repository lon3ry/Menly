const { Schema, model }= require('mongoose');

const MemberSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    coins: {
        type: Number, 
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    xp: {
        type: Number,
        required: true,
        default: 0
    },
    messages: {
        type: Number,
        required: true,
        default: 0
    },
    minVoice: {
        type: Number,
        required: true,
        default: 0
    },
    timeJoin: {
        type: Date,
        required: true,
        default: new Date()
    },
    countStatus: {
        type: String,
        required: true,
        default: 'stop'
    }
});

module.exports = model('members', MemberSchema);