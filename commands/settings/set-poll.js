const Discord = require('discord.js');
const ChannelPollsSchema = require('../../schemas/channel-poll-schema.js');

const getEmoji = async (emojiText, guild) => {
  if (emojiText.includes(':')) {
    console.log('custom emoji');
    const emojiID = emojiText.split(':')[2].replace('>', '');
    console.log(emojiID)
    const emoji = await guild.emojis.cache.get(emojiID);
    return emoji;
  } else {
    return emojiText.trim();
  }
}

module.exports = {
  commands: ['setpoll', 'set-poll', 'set_poll'],
  group: 'Settings',
  description: 'Edititng poll\'s settings',
  usage: '<channel> <emoji>',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const emoji = await getEmoji(args[1], message.guild);
      const channel = await message.mentions.channels.first()

      if (!channel) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.noTagChannelError}**`)
        await message.channel.send(embed);
        return;
      }

      const result = await ChannelPollsSchema.findOneAndUpdate({
        guildID: `${message.guild.id}`,
        channelID: `${channel.id}`
      }, {
        $push: {
          emojisID: emoji
        }
      }, { upsert: true, new: true });
      await message.react('☑️');
      console.log(`[${message.guild.name}][SET-POLL][SUCCES] set poll in channel ${channel.name} ${emoji}`)

    } catch (err) {
      return;
    }
  }
}
