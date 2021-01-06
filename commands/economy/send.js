const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['send', 'sendCoins', 'coinsSend'],
  group: 'Economy',
  description: 'Sending coins between members',
  usage: '<@member> <ammount>',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, args, text, commandText, bot) => {
    try {

      let ammount = Math.trunc(args[1]); // float to number
      const target = message.mentions.members.first();

      senderOldData = await MemberSchema.findOne({ userID: `${message.member.id}`, guildID: `${message.guild.id}` }); // check sender data

      if (senderOldData.coins - ammount < 0) { // if sender doesnt have coins to send
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.noMoneyError[0]} **${ammount}** ${commandText.noMoneyError[1]}`)
        await message.channel.send(embed);
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

    } catch (err) {
      console.log(`[${message.guild.name}][SEND][ERROR]`, err);
      return;
    }
  }
}