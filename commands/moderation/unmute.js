const Discord = require('discord.js');
const MuteSchema = require('../../schemas/mute-schema.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['unmute', 'userunmute', 'muteclear'],
  group: 'Moderation',
  description: 'Unmutes member',
  usage: '<@member>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const { guild, author, member } = message;
      const target = message.mentions.members.first();
      
      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${author}, **${commandText.errors.noTagUserError}**`)
        await message.channel.send(embed);
        return;
      }

      const targetMute = await MuteSchema.findOne({ userID: `${target.id}`, guildID: `${guild.id}`, active: true });

      if (!targetMute) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${author}, **${commandText.alreadyUnmutedError}**`)
        await message.channel.send(embed);
        return;
      }

      await MuteSchema.deleteOne({ userID: `${target.id}`, guildID: `${guild.id}`, active: true });
      const { muteRole: muteRoleID } = await GuildSchema.findOne({ guildID: `${guild.id}` });
      const muteRole = await guild.roles.cache.get(muteRoleID);
      await target.roles.remove(muteRole);
      await message.react('☑️');
      console.log(`[${message.guild.name}][UNMUTE][SUCCES] unmuted ${target.displayName}`);
      
    } catch {
      return;
    }
  }
}