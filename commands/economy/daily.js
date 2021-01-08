const Discord = require('discord.js');
const DailySchema = require('../../schemas/daily-schema.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['daily', 'dailyaward', 'claim'],
  group: 'Economy',
  description: 'Everyday award',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text, commandText, bot) => {
    try {

      const memberQuery = { guildID: `${message.guild.id}`, userID: `${message.author.id}` };
      const data = await DailySchema.findOne(memberQuery); // find data
      const timeNow = new Date();

      if (!data || data.nextAwardTime < timeNow) { // check if awards already claimed
        const awards = [500, -500, 1000, 300, 100, -100, 50, 5000];
        const award = awards[Math.floor(Math.random() * awards.length)];
        await DailySchema.updateOne(memberQuery, {
          $set: {
            nextAwardTime: timeNow.setHours(timeNow.getHours() + 24)
          }
        }, { upsert: true, new: true })
        await MemberSchema.updateOne(memberQuery, { $inc: { coins: award } });
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:money_with_wings: ${message.author}, ${commandText.succes.description[0]} **${award}** ${commandText.succes.description[1]}`)
        await message.channel.send(embed);

      } else {
        await message.react('🚫');
        const diffTime = Math.abs(data.nextAwardTime.getTime() - timeNow.getTime());
        const diffMinutes = Math.floor(Math.floor(diffTime / (1000 * 60 * 60)) * 60 - diffTime / (1000 * 60)); // getting minutes
        const diffHours = Math.trunc((diffTime / (1000 * 60) - diffMinutes) / 60); // getting hours
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:money_with_wings: ${message.author}, **${commandText.alreadyClaimedError[0]}**. ${commandText.alreadyClaimedError[1]} **${diffHours}h ${60 - diffMinutes == 60 ? 0 : 60 - diffMinutes}m**`)
        await message.channel.send(embed);
      }

    } catch (err) {
      console.log(`[${message.guild.name}][DAILY][ERROR]`, err);
      return;
    }
  }
}