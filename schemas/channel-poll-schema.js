const { Schema, model } = require('mongoose');

const ChannelPollsSchema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    channelID: {
      type: String,
      required: true
    },
    emojisID: {
      type: Array,
      required: true
    }
});

module.exports = model('channel-polls', ChannelPollsSchema);