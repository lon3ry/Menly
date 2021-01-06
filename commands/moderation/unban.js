const Discord = require('discord.js');

module.exports = {
  commands: 'unban',
  group: 'Moderation',
  description: 'Unbans member',
  usage: '<@member>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['MANAGE_MESSAGES'],
  callback: async (message, args, text, commandText, bot) => {
    try {

      const { guild, author } = message;
      const target = message.mentions.users.first()
      
      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.noTagUserError}**`)
        await message.channel.send(embed);
        return;
      }

      await guild.members.unban(target, 'Bot command!');
      console.log(`[${message.guild.name}][UNBAN][SUCCES] unbanned ${target.username}`);
      await message.react('☑️');

      const channel = guild.channels.cache.filter((channel) => channel.type === 'text').first();
      if (!channel) {
        return;
      }
      await channel.createInvite({ maxAge: 0, maxUses: 0 }).then(async (invite) => {
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setTitle(commandText.succes.name)
          .setDescription(`${commandText.succes.description[0]} **${guild.name}** ${commandText.succes.description[1]} **${author}**\n[${commandText.succes.description[2]}](${invite})`)
          .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
        await target.send(embed);
      });
      
    } catch (err) {
      return;
    }
  }
}