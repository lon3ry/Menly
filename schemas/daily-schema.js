const { Schema, model } = require('mongoose');

const dailyRewardsSchema = new Schema({
  guildID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  nextAwardTime: {
    type: Date,
    required: true,
    default: new Date()
  }
});

module.exports = model('daily-rewards', dailyRewardsSchema);