const Discord = require('discord.js');
const GuildSchema = require('../schemas/guild-schema.js');
const CounterSchema = require('../schemas/counter-schema.js');

const updateChannel = async (guild) => {
  const isChannelCreated = await CounterSchema.findOne({ guildId: `${guild.id}` });

  if (!isChannelCreated) {
    return;
  }
  const { membersChannel: channelData } = isChannelCreated;
  const channel = await guild.channels.cache.get(channelData.id);

  if (!channel) {
    return;
  }
  await channel.setName(`${channelData.name}: ${guild.memberCount}`);
  console.log(`[${guild.name}][COUNTER-CHANNEl][SUCCES] updated counter channel`);
}

module.exports = bot => {
  bot.on('guildMemberAdd', async (member) => {
    await updateChannel(member.guild);
  });

  bot.on('guildMemberRemove', async (member) => {
    await updateChannel(member.guild);
  });
}