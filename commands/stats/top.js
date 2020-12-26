const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['top', 'leaderboard', 'list'],
  group: 'Stats',
  description: 'Отображает лидеров по статистике в заданной категории',
  usage: '<category>',
  permissionError: 'недостаточно прав',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text, bot) => {
    try {
      let category = args[0];
      if (category == 'voice') {
        category = 'minVoice'
      }
      let sort = {};
      sort[category] = -1;
      const Stats = await MemberSchema.find({ guildId: `${message.guild.id}` }, null, { sort: sort, limit: 10 });
      if (Stats.length < 10) {
        await message.delete(message);
        let embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, список лидеров по статистике ещё не сформирован`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
        return;
      }
      let usersStats = [];
      let usersNames = [];
      for (const stat of Stats) {
        if (category == 'minVoice') {
          let hrs = stat[`${category}`] / 60;
          usersStats.push(parseFloat(hrs.toFixed(1)));
          let user = message.guild.members.cache.get(stat['userId']);
          usersNames.push(user.displayName);
        } else {
          usersStats.push(stat[`${category}`]);
          let user = message.guild.members.cache.get(stat['userId']);
          usersNames.push(user.displayName);
        }
      }
      let embedName = new Map()
        .set('minVoice', 'Топ участников по часам в голосовых каналах')
        .set('messages', 'Топ участников по количеству сообщений')
        .set('xp', 'Топ участников по количеству опыта')
        .set('coins', 'Топ участников по количеству коинов')
      let embed = new Discord.MessageEmbed()
        .setColor('0085FF')
        .setDescription(`**:first_place: ${usersNames[0]}: ${usersStats[0]}\n \n:second_place: ${usersNames[1]}: ${usersStats[1]}\n \n:third_place: ${usersNames[2]}: ${usersStats[2]}**\n \n:medal: ${usersNames[3]}: ${usersStats[3]}\n \n:medal: ${usersNames[4]}: ${usersStats[4]}\n \n:medal: ${usersNames[5]}: ${usersStats[5]}\n \n:medal: ${usersNames[6]}: ${usersStats[6]}\n \n:medal: ${usersNames[7]}: ${usersStats[7]}\n \n:medal: ${usersNames[8]}: ${usersStats[8]}\n \n:medal: ${usersNames[9]}: ${usersStats[9]}`)
        .setAuthor(embedName.get(category), bot.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
      await message.channel.send(embed);
      
    } catch (err) {
      return;
    }
  }
}
