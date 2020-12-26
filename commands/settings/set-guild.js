const Discord = require('discord.js');
const GuildSchema = require('../../schemas/guild-schema.js');

const updateDb = async (guild, category, value) => {
  let query = {};
  query[`${category}`] = value;
  const result = await GuildSchema.findOneAndUpdate({ 
    guildId: `${guild.id}` 
  },{
    $set: query
  });
  return result;
}

module.exports = {
  commands: ['setguild', 'set_guild', 'set-guild'],
  group: 'Settings',
  description: 'Устанавливает параметры для сервера',
  usage: 'afkchannel\nsetguild prefix <prefix>\nsetguild muterole <@role>\nsetguild cmdschannel <@channel>',
  permissionError: 'недостаточно прав',
  minArgs: 1,
  maxArgs: 2,
  permissions: ['ADMINISTRATOR', 'VIEW_GUILD_INSIGHTS'],
  callback: async (message, args, text, bot) => {
    try {

      const { mentions, guild, member } = message;
      const category = args[0];

      if (category == 'afkchannel') {
  
        if (!guild.afkChannel) {
          await message.delete(message)
          const embed = new Discord.MessageEmbed()
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: **Афк-канал не установлен на сервере!** Присвойте его в настройках сервера, чтобы воспользоваться данной командой`)
          await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
          return;
        }
  
        const result = await GuildSchema.findOneAndUpdate({ guildId: `${guild.id}` }, { $set: { afkChannel: `${guild.afkChannel.id}` } });
        console.log(`[AFK-CHANNEL][SUCCES] changed afk-channel for ${guild.name}`, result);
  
      } else if (category == 'prefix') {
  
        const prefix = args[1];
  
        if (prefix == undefined) {
          await message.delete(message);
          const embed = new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: ${member}, укажите префикс, который следует установить`)
          await member.send(embed);
          return;
        }
  
        const result = await updateDb(guild, 'prefix', prefix);
        console.log(`[${guild.name}][SET-GUILD][SUCCES] prefix successfully changed to ${prefix}`, result);
        const embed = new Discord.MessageEmbed()
          .setAuthor(guild.name, guild.iconURL())
          .setColor('0085FF')
          .setDescription(`:ballot_box_with_check: Префикс успешно изменен на **\`\`${prefix}\`\`**`)
        await member.send(embed);
  
      } else if (category == 'cmdschannel') {
        
        const channel = mentions.channels.first();
  
        if (!channel) {
          await message.delete(message)
          const embed = new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: ${member}, указанный канал неверен. Укажите другой канал, или проверьте правильность написания`)
          await member.send(embed);
          return;
        }
  
        const result = await updateDb(guild, 'commandChannel', channel.id);
        console.log(`[${guild.name}][SET-GUILD][SUCCES] changed cmds-channel to channel with name ${channel.name}`, result);
  
      } else if (category == 'muterole') {
        const muteRole = mentions.roles.first();
        if (!muteRole) {
          await message.delete(message);
          const muteRole = message.mentions.roles.first();
          const Embed = new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: ${member} укажите роль, которую нужно установить`)
          await member.send(Embed);
          return;
        }
  
        const result = await updateDb(guild, 'muteRole', muteRole.id);
        console.log(`[MUTE-ROLE][SUCCES] changed mute-role for ${guild.name}`, result);
      }
      await message.react('☑️');

    } catch (err) {
      return;
    }
  }
}
