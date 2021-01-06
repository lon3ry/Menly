const Discord = require('discord.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['set-afkchannel', 'set_afkchannel', 'setafkchannel'],
  group: 'Settings',
  description: 'Setting afk-channel for voicecount',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR', 'VIEW_GUILD_INSIGHTS'],
  callback: async (message, args, text, commandText, bot) => {
    try {

      if (!message.guild.afkChannel) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.afkChannelNotFoundError}`)
        await message.channel.send(embed);
        return;
      }

      await message.react('☑️');
      const result = await GuildSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, { $set: { afkChannel: `${message.guild.afkChannel.id}` } });
      console.log(`[${message.guild.name}][AFK-CHANNEL][SUCCES] changed afk-channel`, result);

    } catch (err) {
      console.log(`[${message.guild.name}][AFK-CHANNEL][ERROR]`, err);
      return;
    }
  }
}