const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

module.exports = {
  commands: ['patchnote', 'releasenote'],
  group: 'Embeds',
  description: 'List of changes in latest bot\'s update',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, args, text, commandText, bot) => {
    try {
      const embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setTitle(commandText.succes.name)
        .setDescription(commandText.succes.description)
        .setTimestamp()
      await message.channel.send(embed);

    } catch (err) {
      console.log(`[${message.guild.name}][PATCH-NOTE][ERROR]`, err);
      return;
    }
  }
}
