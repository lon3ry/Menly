const { Schema, model } = require('mongoose');

const MuteSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    reason: {
      type: String,
      required: true,
      default: 'Not indicated'  
    },
    staffTag: {
        type: String,
        required: true,
    },
    staffID: {
        type: String,
        required: false,
    },
    muteStarted: {
        type: Date,
        required: true,
        default: new Date()
    }, 
    muteEnded: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

module.exports = model('mutes', MuteSchema);