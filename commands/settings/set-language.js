const Discord = require('discord.js');
const GuildSchema = require('../../schemas/guild-schema.js');
const { languages } = require('../../messages.json');

module.exports = {
  commands: ['set-language', 'set_language', 'setlanguage', 'setlang'],
  group: 'Settings',
  description: 'Setting guild\'s language',
  usage: '<language: english/russian>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR', 'VIEW_GUILD_INSIGHTS'],
  callback: async (message, args, text, commandText, bot) => {
    try {

      const language = args[0];

      if (!languages.includes(language)) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.languageIsIncorrectError}**`)
        await message.channel.send(embed);
        return;
      }

      const result = await GuildSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, {
        $set: {
          language: language
        }
      })
      await message.react('☑️');
      console.log(`[${message.guild.name}][SET-LANGUAGE][SUCCES] language changed to ${language}`, result);

    } catch (err) {
      console.log(`[${message.guild.name}][SET-LANGUAGE][ERROR]`, err);
      return;
    }
  }
}