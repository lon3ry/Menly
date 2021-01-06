const Discord = require('discord.js');
const GuildSchema = require('../../schemas/guild-schema.js');

module.exports = {
  commands: ['set-muterole', 'set_muterole', 'setmuterole'],
  group: 'Settings',
  description: 'Setting guild\'s mute-role',
  usage: '<@role>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['ADMINISTRATOR', 'VIEW_GUILD_INSIGHTS'],
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const role = await message.mentions.roles.first();
      
      if (!role) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.noTagRoleError}**`)
        await message.channel.send(embed);
        return;
      }

      const result = await GuildSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, { $set: { muteRole: role.id }})
      await message.react('☑️');
      console.log(`[${message.guild.name}][SET-MUTEROLE][SUCCES] mute-role successfully changed to ${role.name}`, result)

    } catch (err) {
      console.log(`[${message.guild.name}][SET-MUTEROLE][ERROR]`, err);
      return;
    }
  }
}