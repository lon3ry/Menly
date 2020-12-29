const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['send', 'sendCoins', 'coinsSend'],
  group: 'Economy',
  description: 'Перечисление коинов на другой счёт',
  usage: '<@member> <ammount>',
  permissionError: 'недостаточно прав',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, args, text, bot) => {
    try {

      let ammount = Math.trunc(args[1]); // float to number
      const target = message.mentions.members.first();

      senderOldData = await MemberSchema.findOne({ userID: `${message.member.id}`, guildID: `${message.guild.id}` }); // check sender data

      if (senderOldData.coins - ammount < 0) { // if sender doesnt have coins to send
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, у вас недостаточно средств, чтобы осуществить перевод размером ${ammount}`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
        return;
      }

      await MemberSchema.findOneAndUpdate({ userID: `${message.member.id}`, guildID: `${message.guild.id}` }, {
        $inc: {
          coins: -ammount
        }
      });

      await MemberSchema.findOneAndUpdate({ userID: `${target.id}`, guildID: `${message.guild.id}` }, {
        $inc: {
          coins: ammount
        }
      }, { new: true, upsert: true })
      await message.react('☑️');
      console.log(`[${message.guild.name}][SEND][SUCCES] sended ${ammount} coins from ${message.member.displayName} to ${target.displayName}`);

    } catch {
      return;
    }
  }
}