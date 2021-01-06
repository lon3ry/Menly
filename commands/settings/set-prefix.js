const Discord = require('discord.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['set-prefix', 'set_prefix', 'setprefix'],
  group: 'Settings',
  description: 'Setting guild\'s prefix',
  usage: '<prefix>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR', 'VIEW_GUILD_INSIGHTS'],
  callback: async (message, args, text, commandText, bot) => {
    try {

      const prefix = args[0];
      const result = await GuildSchema.findOneAndUpdate({
        guildID: `${message.guild.id}`
      }, {
        $set: {
          prefix: `${prefix}`
        }
      });

      await message.react('☑️');
      const embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setDescription(`:ballot_box_with_check: ${message.author}, ${commandText.succes.description} **\`\`${prefix}\`\`**`)
      await message.channel.send(embed);
      console.log(`[${message.guild.name}][SET-PREFIX][SUCCES] prefix successfully changed to ${prefix}`, result);

    } catch (err) {
      console.log(`[${message.guild.name}][SET-PREFIX][ERROR]`, err);
      return;
    }
  }
}