const Discord = require('discord.js');
const ChannelPollsSchema = require('../../schemas/channel-poll-schema.js');

const getEmojiID = async (emojiText, guild) => {
  if (emojiText.includes(':')) {
    console.log('custom emoji');
    const emojiID = emojiText.split(':')[2].replace('>', '');
    console.log(emojiID)
    const emoji = await guild.emojis.cache.get(emojiID);
    return emoji.id;
  } else {
    return emojiText.trim();
  }
}

module.exports = {
  commands: ['delete-poll', 'deletepoll', 'delete_poll'],
  group: 'Settings',
  description: 'Удаление настроек канала с опросами',
  usage: '<channel> <emoji>\ndeletepoll all',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, args, text, commandText, bot) => {
    try {

      const channel = message.mentions.channels.first(); 
      const data = await ChannelPollsSchema.findOne({ guildID: `${message.guild.id}`, channelID: `${channel.id}`});

      if (!data) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author} **${commandText.noDataFoundError[0]} ${channel} ${commandText.noDataFoundError[1]}**!`)
        await message.channel.send(embed);
        return;
      }

      if (args[1] == 'all') {
        await ChannelPollsSchema.deleteOne({
          guildID: `${message.guild.id}`,
          channelID: `${channel.id}`
        });
        return;
      } else {
        const emoji = await getEmojiID(args[1])
        await ChannelPollsSchema.updateOne({
          guildID: `${message.guild.id}`,
          channelID: `${channel.id}`
        }, {
          $pull: {
            emojisID: emoji
          }
        });
      }
      await message.react('☑️');

    } catch (err) {
      console.log(`[${message.guild.name}][DELETE-POLL][ERROR]`, err)
      return;
    }
  }
}
