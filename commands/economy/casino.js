const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['casino', 'coinscasino', 'coinsflip', 'coinflip', 'flip'],
  group: 'Economy',
  description: 'Random casino vs bot',
  usage: '<ammount>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      let ammout = Math.trunc(args[0]);
      if (ammout < 50 || ammout > 5000) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.outOfRangeMoneyError}`)
        await message.author.send(embed);
        return;
      }

      let { coins: authorCoins } = await MemberSchema.findOne({ userID: `${message.author.id}`, guildID: `${message.guild.id}` });
      if (authorCoins < ammout) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.displayName, message.author.displayAvatarUrl({ dynamic: true }))
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.noMoneyError} **${ammout}**`)
        await message.author.send(embed);
        return;
      }
      let players = ['bot', 'user'];
      let winner = players[Math.floor(Math.random() * players.length)]; // random winner from array

      if (winner == 'bot') {
        await MemberSchema.updateOne({ userID: `${message.author.id}`, guildID: `${message.guild.id}` }, { $inc: { coins: -ammout } }); // updating loser db
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:trophy: ${commandText.succes.description[0]} ${bot.user}. ${commandText.succes.description[1]} **${ammout}**`)
        await message.channel.send(embed);

      } else {
        await MemberSchema.updateOne({ userID: `${message.author.id}`, guildID: `${message.guild.id}` }, { $inc: { coins: ammout } }); // updating winner db
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:trophy: ${commandText.succes.description[0]} ${message.member}. ${commandText.succes.description[1]} **${ammout}**`)
        await message.channel.send(embed);
      }

    } catch (err) {
      console.log(`[${message.guild.name}][CASINO][ERROR]`, err);
      return;
    }
  }
}
