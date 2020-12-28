const Discord = require('discord.js');
const GuildSchema = require('../schemas/guild-schema.js');
const MuteSchema = require('../schemas/mute-schema.js');

module.exports = bot => {
  const checkMutes = async () => {
    const timeNow = new Date();
    const conditional = {
      muteEnded: {
        $lt: timeNow
      },
      active: true
    }

    const results = await MuteSchema.find(conditional);
    console.log('[MUTES][SUCCES]', results);

    if (results && results.length) {
      for (result of results) {
        const { guildId, userId } = result;
        const guild = bot.guilds.cache.get(guildId);
        const { muteRole: muteRoleId } = await GuildSchema.findOne({ guildId: `${guild.id}` });
        const muteRole = guild.roles.cache.get(muteRoleId);
        const member = guild.members.cache.get(userId);
        await member.roles.remove(muteRole);
      }
      await MuteSchema.updateMany(conditional, { active: false });
    }
    setTimeout(checkMutes, 1000 * 60 * 1);
  }
  checkMutes();

  bot.on('guildMemberAdd', async (member) => {
    const isMuted = await MuteSchema.find({ userId: `${member.id}`, guildId: `${member.guild.id}` });
    if (isMuted) {
      const { muteRole: muteRoleId } = await GuildSchema.findOne({ guildId: `${member.guild.id}` });
      const muteRole = member.guild.roles.cache.get(muteRoleId);
      await member.roles.add(muteRole);
    }
  });
}