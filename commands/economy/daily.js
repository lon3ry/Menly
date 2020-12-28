const Discord = require('discord.js');
const DailySchema = require('../../schemas/daily-schema.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['daily', 'dailyaward', 'claim'],
  group: 'Economy',
  description: 'Перечисление коинов на другой счёт',
  usage: '',
  permissionError: 'недостаточно прав',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text, bot) => {
    try {

      const memberQuery = { guildId: `${message.guild.id}`, userId: `${message.author.id}` };
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
          .setColor('0085FF')
          .setDescription(`:money_with_wings: ${message.author}, ваша награда на сегодня **${award}** коинов`)
        await message.channel.send(embed);

      } else {
        await message.react('🚫');
        const diffTime = Math.abs(data.nextAwardTime.getTime() - timeNow.getTime());
        const diffMinutes = Math.floor(Math.round(diffTime / (1000 * 60 * 60)) * 60 - diffTime / (1000 * 60)); // getting minutes
        const diffHours = Math.trunc((diffTime / (1000 * 60) - diffMinutes) / 60); // getting hours
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:money_with_wings: ${message.author}, **вы уже получили награды за сегодня!** Следующие награды через **${diffHours} часов ${60 - diffMinutes == 60 ? 0 : 60 - diffMinutes} минут**`)
        await message.channel.send(embed);
      }

    } catch {
      return;
    }
  }
}