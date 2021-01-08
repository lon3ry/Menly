const Discord = require('discord.js');

module.exports = {
  commands: ['clear', 'clearchat'],
  group: 'Moderation',
  description: 'Clears chat',
  usage: '<ammout>',
  minArgs: 1,
  maxArgs: 1,
  permissions: ['MANAGE_MESSAGES'],
  callback: async (message, args, text, commandText, bot) => {
    try {

      const ammount = Math.trunc(args[0]) + 1;
      
      if (ammount > 100) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author},${commandText.clearAmmountError} **100**`)
        await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
        return;
      }

      await message.channel.messages.fetch().then(async (messages) => {
        await message.channel.bulkDelete(ammount);
      });

      let embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setDescription(`☑️${message.author}, ${commandText.succes.description[0]} **${args[0]}** ${commandText.succes.description[1]}`)
      await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) }).catch((err) => {return});
      console.log(`[${message.guild.name}][CLEAR][SUCCES] cleared ${ammount} messages`);

    } catch (err) {
      console.log(`[${message.guild.name}][CLEAR][ERROR]`, err);
      return;
    }
  }
}