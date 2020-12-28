const MemberSchema = require('../schemas/member-schema.js');
const GuildSchema = require('../schemas/guild-schema.js');
const { stopCount } = require('../utils/voicefunc.js');


module.exports = async (bot) => {
  try {
    bot.guilds.cache.forEach(async (guild) => {
      const inDbStatus = await GuildSchema.countDocuments({ guildId: `${guild.id}` });
      if (inDbStatus == 0) {
        const guildData = new GuildSchema({
          guildId: `${guild.id}`,
          prefix: '!',
          afkChannel: `${guild.afkChannelID}`,
        })
        await guildData.save();
      }
    });
    await MemberSchema.find({ countStatus: 'start' }, async (err, data) => {
      for (el of data) {
        const guild = await bot.guilds.cache.get(el.guildId);
        const member = await guild.members.cache.get(el.userId);
        
        if (member.voice.channel == null || member.voice.channel.members.array().length < 2) {
          await stopCount(member)
        }	
      }
    });

  } catch (err) {
    console.log('[CHECK-DATA][ERROR]', err);
    return;
  }
}