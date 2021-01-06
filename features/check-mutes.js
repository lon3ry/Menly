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
        const { guildID, userID } = result;
        const guild = bot.guilds.cache.get(guildID);
        const { muteRole: muteRoleId } = await GuildSchema.findOne({ guildID: `${guild.id}` });
        const muteRole = guild.roles.cache.get(muteRoleId);
        const member = guild.members.cache.get(userID);
        await member.roles.remove(muteRole);
      }
      await MuteSchema.updateMany(conditional, { active: false });
    }
    setTimeout(checkMutes, 1000 * 60 * 1);
  }
  checkMutes();

  bot.on('guildMemberAdd', async (member) => {
    const isMuted = await MuteSchema.findOne({ userID: `${member.id}`, guildID: `${member.guild.id}`, active: true });
    if (!isMuted) {
      return;
    }
    const { muteRole: muteRoleID } = await GuildSchema.findOne({ guildID: `${member.guild.id}` });
    const muteRole = member.guild.roles.cache.get(muteRoleID);
    await member.roles.add(muteRole);
  });
}