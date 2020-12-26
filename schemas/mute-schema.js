const { Schema, model } = require('mongoose');

const MuteSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
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
    staffId: {
        type: String,
        required: true
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