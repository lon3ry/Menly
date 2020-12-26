const { Schema, model } = require('mongoose');

const dailyRewardsSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  userId: {
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