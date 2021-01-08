const Discord = require('discord.js');

module.exports = {
  commands: ['kick', 'userkick'],
  group: 'Moderation',
  description: 'Kicks member',
  usage: '<@member>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      let target = message.mentions.users.first();

      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.noTagUserError}**`)
        await message.channel.send(embed);
        return;
      }

      const targetMember = message.guild.members.cache.get(target.id);

      if (!targetMember) {
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.noMemberOnGuildError[0]}**`)
        await message.channel.send(embed);
        return;
      }
      
      await targetMember.kick();
      let embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setTitle(commandText.succes.name)
        .setDescription(`${commandText.succesKick[0]} **${targetMember.guild.name}**${commandText.succesKick[1]} **${message.author}**`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
      await target.send(embed);
      
      await message.react('☑️');
      console.log(`[${message.guild.name}][KICK][SUCCES] kicked ${targetMember.displayName}`);

    } catch (err) {
      console.log(`[${message.guild.name}][KICK][ERROR]`, err);
      return;
    }
  }
}