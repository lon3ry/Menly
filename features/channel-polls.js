const ChannelPollsSchema = require('../schemas/channel-poll-schema.js');

module.exports = async (bot) => {
  bot.on('message', async (message) => {
    if (message.channel.type !== 'text') {
      return;
    }


    const data = await ChannelPollsSchema.findOne({ guildID: `${message.guild.id}`, channelID: `${message.channel.id}` });
    if (!data) {
      return;
    }
    for (emojiID of data.emojisID) {
      if (emojiID.length > 2) {
        const emoji = await message.guild.emojis.cache.get(emojiID);
        await message.react(emoji);
      } else { // if emoji is unicode
        await message.react(emojiID);
      }
    }
  });
}