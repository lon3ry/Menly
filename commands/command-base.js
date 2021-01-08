const Discord = require('discord.js');
const GuildSchema = require('../schemas/guild-schema.js');
const { getCommandText, getErrorsText } = require('../utils/language.js');

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
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    botPermissions = [],
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

    const guildData = await GuildSchema.findOne({ guildID: `${guild.id}` });
    let { prefix, commandChannel, language } = guildData;
    const errorsText = getErrorsText(language);

    for (const alias of commands) {
      if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
        const adminGroups = ['Moderation', 'Embeds', 'Settings', 'Shop'];
        if (adminGroups.indexOf(group) == -1 && commandChannel != `${message.channel.id}` && commandChannel != 'undefined') {
          try {
            const channel = await guild.channels.cache.get(commandChannel);
            let embed = new Discord.MessageEmbed()
              .setColor('E515BD')
              .setDescription(`:no_entry_sign: ${message.author}, **${errorsText.incorrectChatError[0]}**. ${errorsText.incorrectChatError[1]} ${channel}`)
            await message.channel.send(embed);
            return;

          } catch (err) {
            return;
          }
        }

        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            try {
              await message.react('🚫');
              let embed = new Discord.MessageEmbed()
                .setColor('E515BD')
                .setDescription(`:no_entry_sign: ${message.author}, **${errorsText.memberPermissionError}**`)
              await message.channel.send(embed);
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
            await message.react('🚫');
            const commandUsage = usage ? ` ${usage}` : ''
            let embed = new Discord.MessageEmbed()
              .setColor('E515BD')
              .setDescription(`:no_entry_sign: ${message.author}, ${errorsText.syntaxError[0]} **\`\`${prefix}${alias}${commandUsage}\`\`** ${errorsText.syntaxError[1]}`)
            await message.channel.send(embed);
            return;

          } catch (err) {
            return;
          }
        }
        callback(message, arguments, arguments.join(' '), getCommandText(language, commands[0]), bot);
        return;
      }
    }
  });
}