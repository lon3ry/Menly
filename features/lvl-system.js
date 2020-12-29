const mongodb = require('mongodb');
const MemberSchema = require(`../schemas/member-schema.js`);
const GuildSchema = require('../schemas/guild-schema.js');
const mongo = require('../utils/mongo.js');

module.exports = (bot) => {
  bot.on('message', async (message) => {
    const { member, guild } = message;

    if (message.channel.type !== 'text') {
      return;
    }

    if (member.user.bot) {
      return;
    }

    const needXp = level => {
      const needXpMap = new Map()
        .set(1, 0)
        .set(2, 500)
        .set(3, 1500)
        .set(4, 2500)
        .set(5, 4000)
        .set(6, 6000)
        .set(7, 8500)
        .set(8, 10000)
        .set(9, 12500)
        .set(10, 15000)
      level++;
      const xpNeeded = needXpMap.get(level);
      return xpNeeded;
    }
    const result = await MemberSchema.findOneAndUpdate({
      userID: `${member.id}`,
      guildID: `${guild.id}`
    }, {
      $inc: {
        xp: 5,
        messages: 1,
        coins: 1
      }
    }, { new: true, upsert: true });


    let { level, xp } = result;
    const xpToLevel = needXp(level);
    if (xp >= xpToLevel) {
      level++;
    }
    await MemberSchema.findOneAndUpdate({
      userID: `${member.id}`,
      guildID: `${guild.id}`
    }, {
      $set: {
        level: level
      }
    }, {});
  });
}