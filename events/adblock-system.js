const Discord = require('discord.js');

const isOurIvite = async (guild, code) => {
  return await new Promise(resolve => {
    guild.fetchInvites().then((invites) => {
      for (const invite of invites) {
        if (code === invite[0]) {
          resolve(true);
          return;
        }
      }
      resolve(false);
    });
  });
}

module.exports = (bot) => {
  bot.on('message', async (message) => {
    try {
      const { member, guild, content } = message;
      if (content.includes('discord.gg/')) {
        const inviteCode = content.split('discord.gg/')[1];
        const inviteFromGuild = await isOurIvite(guild, inviteCode);
        if (!inviteFromGuild) {
          await message.delete(message);
          console.log(`[${message.guild.name}][ADBLOCK-SYSTEM][SUCCES] deleted invite-spam ${member.displayName}\`s message`);
        }
      }
    } catch {
      return;
    }
  });
}