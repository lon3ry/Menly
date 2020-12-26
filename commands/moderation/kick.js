const Discord = require('discord.js');

module.exports = {
  commands: ['kick', 'userkick'],
  group: 'Moderation',
  description: 'Выгоняет участника с сервера',
  permissionError: 'у вас недостаточно прав для вызова этой команды',
  usage: '<@member>',
  minArgs: 0,
  maxArgs: 0,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, bot) => {
    try {
      let target = message.mentions.members.first();

      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: **Укажите участника**, которого следует **кикнуть**`)
        await message.channel.send(embed);
        return;
      }
      
      let embed = new Discord.MessageEmbed()
        .setColor('0085FF')
        .setTitle('Блокировка')
        .setDescription(`Вы были исключены с сервера **${target.guild.name}** пользователем **${message.author}**`)
        .setAuthor(target.displayName, target.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
      await target.send(embed);
      await target.kick();
      await message.react('☑️');
      console.log(`[${message.guild.name}][KICK][SUCCES] kicked ${target.displayName}`);
      
    } catch {
      return;
    }
  }
}