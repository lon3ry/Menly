const Discord = require('discord.js');
const MuteSchema = require('../../schemas/mute-schema.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['unmute', 'userunmute', 'muteclear'],
  group: 'Moderation',
  description: 'Размьючивает участника',
  permissionError: 'У вас недостаточно прав для использования данной команды',
  usage: '<@member>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, bot) => {
    try {
      const { guild, author, member } = message;
      const target = message.mentions.members.first();
      
      if (!target) {
        console.log('Missing user');
        return;
      }

      const targetMute = await MuteSchema.findOne({ userId: `${target.id}`, guildId: `${guild.id}`, active: true });

      if (!targetMute) {
        console.log('User already unmuted');
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${author}, **пользователь не находится в муте!**`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
        return;
      }

      await MuteSchema.deleteOne({ userId: `${target.id}`, guildId: `${guild.id}`, active: true });
      const { muteRole: muteRoleId } = await GuildSchema.findOne({ guildId: `${guild.id}` });
      const muteRole = guild.roles.cache.get(muteRoleId);
      await target.roles.remove(muteRole);
      let embed = new Discord.MessageEmbed()
        .setColor('0085FF')
        .setAuthor(member.displayName, member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`:ballot_box_with_check: Пользователь ${target} **успешно** размьючен!`)
      await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
      await message.react('☑️');
      console.log(`[${message.guild.name}][UNMUTE][SUCCES] unmuted ${target.displayName}`);
      
    } catch {
      return;
    }
  }
}