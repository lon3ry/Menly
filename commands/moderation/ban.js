const Discord = require('discord.js');

module.exports = {
  commands: ['ban', 'userban'],
  group: 'Moderation',
  description: 'Банит участника на сервере',
  permissionError: 'у вас недостаточно прав для вызова этой команды',
  usage: '<@member>',
  minArgs: 0,
  maxArgs: 0,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, bot) => {
    try {
      let target = message.mentions.users.first();
      let targetMember = message.guild.members.cache.get(target.id);

      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setTitle('Блокировка')
          .setDescription(`:no_entry_sign: ${author}, укажите пользователя, которого следует заблокировать`)
          .setAuthor(target.displayName, target.user.displayAvatarURL({dynamic:true}))
          .setTimestamp()
        await message.channel.send(embed).then(message => {message.delete({ timeout: 5 * 1000})});
      }
      
      await targetMember.ban();
      let embed = new Discord.MessageEmbed()
        .setColor('0085FF')
        .setTitle('Блокировка')
        .setDescription(`Вы были заблокированы на сервере **${target.guild.name}** пользователем **${message.author}**`)
        .setAuthor(target.displayName, target.user.displayAvatarURL({dynamic:true}))
        .setTimestamp()
      await target.send(embed);
      await message.react('☑️');
      console.log(`[${message.guild.name}][BAN][SUCCES] banned ${target.displayName}`);
      
    } catch {
      return;
    }
  }
}