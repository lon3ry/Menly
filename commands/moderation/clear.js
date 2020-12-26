const Discord = require('discord.js');

module.exports = {
  commands: ['clear', 'clearchat'],
  group: 'Moderation',
  description: 'Отчищает чат',
  permissionError: 'у вас недостаточно прав для вызова этой команды',
  usage: '<ammout>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['MANAGE_MESSAGES'],
  callback: async (message, args, text, bot) => {
    try {
      const ammount = parseInt(args[0]) + 1;

      if (ammount > 100) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, число удаляемых сообщений должно быть до **100**`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
        return;
      }

      await message.channel.messages.fetch().then(async (messages) => {
        await message.channel.bulkDelete(ammount);
      });
      
      let embed = new Discord.MessageEmbed()
        .setColor('0085FF')
        .setDescription(`☑️${message.author}, успешно удалено **${args[0]}** сообщений!`)
      await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) }).catch((err) => {return});
      console.log(`[${message.guild.name}][CLEAR][SUCCES] cleared ${ammount} messages`);

    } catch (err) {
      return;
    }
  }
}