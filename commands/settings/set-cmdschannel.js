const Discord = require('discord.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['set-cmdschannel', 'set_cmdschannel', 'setcmdschannel'],
  group: 'Settings',
  description: 'Setting guild\'s commands channel',
  usage: '<@channel>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR', 'VIEW_GUILD_INSIGHTS'],
  callback: async (message, args, text, commandText, bot) => {
    try {

      const channel = message.mentions.channels.first();

      if (!channel) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.errors.noTagChannelError}`)
        await message.channel.send(embed);
        return;
      }

      const result = await GuildSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, { $set: { commandChannel: channel.id } })
      await message.react('☑️');
      console.log(`[${message.guild.name}][SET-GUILD][SUCCES] changed cmds-channel to channel with name ${channel.name}`, result);

    } catch {
      console.log(`[${message.guild.name}][SET-GUILD][ERROR]`, err)
    }
  }
}