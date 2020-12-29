const { Schema, model } = require('mongoose');

const CounterSchema = new Schema({
  guildID: {
    type: String,
    required: true
  },
  membersChannel: {
    id: {
      type: String,
      required: true,
      default: 'not created'
    },
    name: {
      type: String,
      required: true,
      default: '👤 Members'
    }
  }
});

module.exports = model('count-channels', CounterSchema);