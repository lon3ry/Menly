const Discord = require('discord.js');
const MuteSchema = require('../../schemas/mute-schema.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['usermute', 'mute', 'muteuser', 'membermute', 'mutemember'],
  group: 'Moderation',
  description: 'Mutes member',
  usage: '<@member> <reason> <time: 25h, 15m...>',
  minArgs: 3,
  maxArgs: 3,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const { guild, member: staff } = message;
      const target = message.mentions.members.first();
      const reason = args[1];
      const muteTimeString = args[2];

      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.errors.noTagUserError}`)
        await message.channel.send(embed);
        return;
      }
      const previousMutes = await MuteSchema.findOne({ guildID: `${message.guild.id}`, userID: `${target.id}`, active: true})

      if (previousMutes !== null) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.alreadyMutedError}**`)
        await message.channel.send(embed);
        return;
      }

      let expires = new Date();
      if (muteTimeString.includes('m')) {
        let duration = parseInt(muteTimeString.replace('m', ''));
        expires.setMinutes(expires.getMinutes() + duration - 5);
      } else if (muteTimeString.includes('h')) {
        let duration = parseInt(muteTimeString.replace('h', ''));
        expires.setMinutes(expires.getMinutes() + duration * 60 - 5);
      }

      const timeNow = new Date();
      const { muteRole: muteRoleID } = await GuildSchema.findOne({ guildID: `${guild.id}` });

      if (muteRoleID == 'undefined') {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${staff}, **${commandText.muteRoleNotFoundError}**`)
        await message.channel.send(embed);
        return;
      }

      const muteRole = guild.roles.cache.get(muteRoleID);
      await target.roles.add(muteRole);
      await new MuteSchema({
        userID: `${target.user.id}`,
        guildID: `${guild.id}`,
        staffTag: `${staff.user.tag}`,
        staffID: `${staff.id}`,
        muteStarted: timeNow,
        muteEnded: expires,
        active: true,
        reason: reason
      }).save();

      let embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setTitle(`${commandText.succes.name}`)
        .setDescription(`${commandText.succes.description[0]}`)
        .addField(commandText.succes.fieldNames[0], guild.name)
        .addField(commandText.succes.fieldNames[1], muteTimeString)
        .addField(commandText.succes.fieldNames[2], reason)
        .addField(commandText.succes.fieldNames[3], staff)
        .setTimestamp()
      await target.send(embed);
      await message.react('☑️');
      console.log(`[${message.guild.name}][USERMUTE][SUCCES] muted ${target.displayName} for ${muteTimeString}`);
      
    } catch (err) {
      console.log(`[${message.guild.name}][USERMUTE][ERROR]`, err);
      return;
    }
  }
}