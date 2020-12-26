const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['casino', 'coinscasino', 'coinsflip', 'coinflip', 'flip'],
  group: 'Economy',
  description: 'Рандомное казино 1v1 против бота',
  usage: '<ammount>',
  permissionError: 'недостаточно прав',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text, bot) => {
    try {
      
      let ammout = args[0];
      if (!ammout) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.displayName, message.author.displayAvatarUrl({dynamic: true}))
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: Укажите сумму ставки!`)
        await message.author.send(embed).then(message => {message.delete({ timeout: 5 * 1000})});
        return;
      }

      if (ammout < 50 || ammout > 5000) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, сумма ставки должна быть в пороге **50-5000** коинов!`)
        await message.author.send(embed);
        return;
      }
      
      let { coins: authorCoins} = await MemberSchema.findOne({userId: `${message.author.id}`, guildId: `${message.guild.id}`});
      if (authorCoins < ammout) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.displayName, message.author.displayAvatarUrl({dynamic: true}))
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, недостаточно средств чтобы сыграть на сумму **${ammout}**`)
        await message.author.send(embed);
        return;
      }
      let players = ['bot', 'user'];
      let winner = players[Math.floor(Math.random()*players.length)]; // random winner from array

      if (winner == 'bot') {
        await MemberSchema.updateOne({userId: `${message.author.id}`, guildId: `${message.guild.id}`}, {$inc: {coins: -ammout}}); // updating loser db
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:trophy: Победу одерживает ${bot.user}. Его выигрыш состовляет **${ammout}**`)
        await message.channel.send(embed);

      } else {
        await MemberSchema.updateOne({userId: `${message.author.id}`, guildId: `${message.guild.id}`}, {$inc: {coins: ammout}}); // updating winner db
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:trophy: Победу одерживает ${message.member}. Его выигрыш состовляет **${ammout}**`)
        await message.channel.send(embed);
      }

    } catch (err) {
      return;
    }
  }
}
