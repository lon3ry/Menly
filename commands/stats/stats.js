const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['stats', 'statistic'],
  group: 'Stats',
  description: 'Отображает вашу статистику',
  permissionError: 'недостаточно прав',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, args, text, bot) => {
    try {
      let member = message.mentions.members.first() || message.member;
      const Stats = await MemberSchema.findOne({ userId: `${member.id}`, guildId: `${member.guild.id}` });
      const Embed = new Discord.MessageEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL({ dynamic: true }))
        .setColor('0085FF')
        .setTitle('Ваша статистика')
        .addFields(
          { name: '**:coin: Количество коинов:**', value: `${Stats.coins}`, inline: false },
          { name: '**:watch: Часы в голосовых каналах:**', value: `${~~Stats.minVoice / 60}`, inline: false },
          { name: '**:speech_balloon: Сообщений:**', value: `${Stats.messages}`, inline: false },
          { name: '**:small_blue_diamond: Опыт:**', value: `${Stats.xp}`, inline: false },
          { name: '**:military_medal: Уровень:**', value: `${Stats.level}`, inline: false },
          { name: '**:chart_with_upwards_trend: Статус начисления:**', value: `${Stats.countStatus}`, inline: false }
        )
        .setTimestamp()
      await message.channel.send(Embed);

    } catch (err) {
      return;
    }
  }
}
