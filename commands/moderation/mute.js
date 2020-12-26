const Discord = require('discord.js');
const MuteSchema = require('../../schemas/mute-schema.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['usermute', 'mute', 'muteuser', 'membermute', 'mutemember'],
  group: 'Moderation',
  description: 'Мьютит участника',
  permissionError: 'У вас недостаточно прав для использования данной команды',
  usage: '<reason> <@member> <time: 25h, 15m...>',
  minArgs: 3,
  maxArgs: 3,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, bot) => {
    try {
      const { guild, author: staff } = message;
      const target = message.mentions.members.first();
      const muteTimeString = args[2];
      const reason = args[1];

      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, укажите пользователя, которого следует замьютить!`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
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
      const { muteRole: muteRoleId } = await GuildSchema.findOne({ guildId: `${guild.id}` });
      console.log('MUTE TIME:', timeNow, expires);
      if (muteRoleId == 'undefined') {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, **на сервере не установлена мьют-роль**, вы можете установить её с помощью команды **\`\`muteRole\`\`**`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
        return;
      }

      const muteRole = guild.roles.cache.get(muteRoleId);
      await target.roles.add(muteRole);
      await new MuteSchema({
        userId: `${target.user.id}`,
        guildId: `${guild.id}`,
        staffTag: `${staff.tag}`,
        staffId: `${staff.id}`,
        muteStarted: timeNow,
        muteEnded: expires,
        active: true,
        reason: reason
      }).save();

      let embed = new Discord.MessageEmbed()
        .setColor('0085FF')
        .setAuthor(`Мьют`, `${bot.user.displayAvatarURL()}`)
        .setDescription(`Вы замьючены на сервере **${guild.name}** на **${muteTimeString}**`)
      await target.send(embed);
      await message.react('☑️');
      console.log(`[${message.guild.name}][MUTE][SUCCES] muted ${target.displayName} for ${muteTimeString}`);
      
    } catch {
      return;
    }
  }
}