const Discord = require('discord.js');

module.exports = {
  commands: 'unban',
  group: 'Moderation',
  description: 'Разблокирует раннее забанненого пользователя',
  usage: '<@member>',
  permissionError: 'у вас недостаточно прав для вызова этой команды',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['MANAGE_MESSAGES'],
  callback: async (message, args, text, bot) => {
    try {

      const { guild, author } = message;
      const targetId = args[0].replace('<@!', '').replace('>', '');
      const target = await bot.users.fetch(targetId);
      await guild.members.unban(target, 'Bot command!');
      const channel = guild.channels.cache.filter((channel) => channel.type === 'text').first();
      console.log(`[${message.guild.name}][UNBAN][SUCCES] unbanned ${target.username}`);
      await message.react('☑️');

      if (!channel) {
        return;
      }

      await channel.createInvite({ maxAge: 0, maxUses: 0 }).then(async (invite) => {
          let embed = new Discord.MessageEmbed()
            .setColor('0085FF')
            .setTitle('Вы снова допущены к серверу')
            .setDescription(`Вы были разблокированы на сервере **${guild.name}** пользователем **${author}**\n[Приглашение на сервер](${invite})`)
            .setAuthor(target.username, target.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
          await target.send(embed);
          await message.react('☑️');
      });
      
    } catch (err) {
      return;
    }
  }
}