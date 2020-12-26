const Discord = require('discord.js');
const GuildSchema = require('../schemas/guild-schema.js')
const validatePermissions = (permissions) => {
  const validPermissions = [
    'ADMINISTRATOR',
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
  ];

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknow permmisions node '${permission}`);
    }
  }
}


module.exports = (bot, commandOptions) => {
  let {
    commands,
    group = '',
    description = '',
    usage = '',
    permissionError = 'У вас недостаточно прав для вызова команды',
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    callback
  } = commandOptions;

  if (typeof commands === 'string') {
    commands = [commands];
  }

  console.log(`[+][command] ${commands[0]}`);

  if (permissions.leight) {
    if (typeof permissions === 'string') {
      permissions = [permissions];
    }
    validatePermissions(permissions);
  }

  bot.on('message', async (message) => {
    const { member, content, guild } = message;

    if (message.channel.type !== 'text') {
      return;
    }

    const guildData = await GuildSchema.findOne({ guildId: `${guild.id}` });
    let { prefix, commandChannel } = guildData;

    for (const alias of commands) {
      if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
        const adminGroups = ['Moderation', 'embeds', 'settings', 'Shop'];
        if (adminGroups.indexOf(group) == -1 && commandChannel != `${message.channel.id}` && commandChannel != 'undefined') {
          try {
            const channel = guild.channels.cache.get(commandChannel);
            let embed = new Discord.MessageEmbed()
              .setColor('0085FF')
              .setDescription(`:no_entry_sign: В этом чате запрещено использовать комманды! Чат для комманд - ${channel}`)
              .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp()
            await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
            return;

          } catch (err) {
            return;
          }
        }
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.delete(message);
            try {
              let embed = new Discord.MessageEmbed()
                .setColor('0085FF')
                .setDescription(`**:no_entry_sign: Ошибка:** ${permissionError}`)
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
              message.author.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
              return;
            } catch (err) {
              return;
            }
          }
        }

        let arguments = content.split(/[ ]+/);
        arguments.shift();
        if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
          try {
            message.delete(message);
            let embed = new Discord.MessageEmbed()
              .setColor('0085FF')
              .setDescription(`:no_entry_sign: **Неправильный синтаксис!** Используйте **\`\`${prefix}${alias} ${usage}\`\`** чтобы воспользоваться данной командой!`)
              .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
            return;

          } catch (err) {
            return;
          }
        }

        callback(message, arguments, arguments.join(' '), bot);
        return;
      }
    }
  });
}