const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['stats', 'statistic'],
  group: 'Stats',
  description: 'Displays your statistic',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      let member = message.mentions.members.first() || message.member;
      const stats = await MemberSchema.findOne({ userID: `${member.id}`, guildID: `${member.guild.id}` });
      const embed = new Discord.MessageEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL({ dynamic: true }))
        .setColor('E515BD')
        .setTitle(commandText.succes.name)
        .addFields(
          { name: `**:coin: ${commandText.succes.fieldNames[0]}:**`, value: `${stats.coins}`, inline: false },
          { name: `**:watch: ${commandText.succes.fieldNames[1]}:**`, value: `${Math.trunc(stats.minVoice / 60)}`, inline: false },
          { name: `**:speech_balloon: ${commandText.succes.fieldNames[2]}:**`, value: `${stats.messages}`, inline: false },
          { name: `**:small_blue_diamond: ${commandText.succes.fieldNames[3]}:**`, value: `${stats.xp}`, inline: false },
          { name: `**:military_medal: ${commandText.succes.fieldNames[4]}:**`, value: `${stats.level}`, inline: false },
          { name: `**:chart_with_upwards_trend: ${commandText.succes.fieldNames[5]}:**`, value: `${stats.countStatus}`, inline: false }
        )
        .setTimestamp()
      await message.channel.send(embed);

    } catch (err) {
      return;
    }
  }
}
