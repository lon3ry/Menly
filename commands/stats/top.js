const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['top', 'leaderboard', 'list'],
  group: 'Stats',
  description: 'Displays leaders of statistic in category',
  usage: '<category>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      let category = args[0];
      if (category == 'voice') {
        category = 'minVoice'
      }
      let sort = {};
      sort[category] = -1;
      const stats = await MemberSchema.find({ guildID: `${message.guild.id}` }, null, { sort: sort, limit: 10 });
      if (stats.length < 10) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.noLeadersError}**`)
        await message.channel.send(embed);
        return;
      }
      let usersStats = [];
      let usersNames = [];
      for (const stat of stats) {
        if (category == 'minVoice') {
          let hrs = stat[`${category}`] / 60;
          usersStats.push(parseFloat(hrs.toFixed(1)));
          let user = message.guild.members.cache.get(stat['userID']);
          usersNames.push(user.displayName);
        } else {
          usersStats.push(stat[`${category}`]);
          let user = message.guild.members.cache.get(stat['userID']);
          usersNames.push(user.displayName);
        }
      }
      let embedName = new Map()
        .set('minVoice', `${commandText.succes.titleNames[0]}`)
        .set('messages', `${commandText.succes.titleNames[1]}`)
        .set('xp', `${commandText.succes.titleNames[2]}`)
        .set('coins', `${commandText.succes.titleNames[3]}`)
      let embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setDescription(`**:first_place: ${usersNames[0]}: ${usersStats[0]}\n \n:second_place: ${usersNames[1]}: ${usersStats[1]}\n \n:third_place: ${usersNames[2]}: ${usersStats[2]}**\n \n:medal: ${usersNames[3]}: ${usersStats[3]}\n \n:medal: ${usersNames[4]}: ${usersStats[4]}\n \n:medal: ${usersNames[5]}: ${usersStats[5]}\n \n:medal: ${usersNames[6]}: ${usersStats[6]}\n \n:medal: ${usersNames[7]}: ${usersStats[7]}\n \n:medal: ${usersNames[8]}: ${usersStats[8]}\n \n:medal: ${usersNames[9]}: ${usersStats[9]}`)
        .setTitle(embedName.get(category))
        .setTimestamp()
      await message.channel.send(embed);
      
    } catch (err) {
      return;
    }
  }
}
