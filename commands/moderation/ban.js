const Discord = require('discord.js');

module.exports = {
  commands: ['ban', 'userban'],
  group: 'Moderation',
  description: 'Bans member',
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
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.errors.noTagUserError}`)
        await message.channel.send(embed);
        return;
      }

      let targetMember = await message.guild.members.cache.get(target.id)
      
      if (!targetMember) {
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.errors.noMemberOnGuildError}`)
        await message.channel.send(embed);
        return;
      }
      
      await targetMember.ban();
      await message.react('☑️');
      let embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setTitle(commandText.succes.name)
        .setDescription(`${commandText.succes.description[0]} **${targetMember.guild.name}**${commandText.succes.description[1]} **${message.author}**`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
      await target.send(embed);
      console.log(`[${message.guild.name}][BAN][SUCCES] banned ${targetMember.displayName}`);
      
    } catch (err) {
      console.log(`[${message.guild.name}][BAN][ERROR]`, err);
      return;
    }
  }
}