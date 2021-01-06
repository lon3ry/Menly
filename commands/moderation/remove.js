const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');

const updateDb = async (target, category, ammount) => {
  let query = {};
  query[`${category}`] = -ammount;
  const result = await MemberSchema.findOneAndUpdate( {userID: `${target.id}`, guildID: `${target.guild.id}`}, {$inc: query});
  return result;
}

module.exports = {
  commands: 'remove',
  group: 'Moderation',
  description: 'Removes coins/hrsvoice from member',
  usage: '<@member> <hrs / coins> <ammount>',
  minArgs: 3,
  maxArgs: 3,
  permissions: ['ADMINISTRATOR'],
  callback: async (message, args, text, commandText, bot) => {
    try {
      let target = message.mentions.members.first();
      let category = args[1];
      let ammount = args[2];
      
      if (!target) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.noTagUserError}**`)
        await message.channel.send(embed);
        return;
      }

      if (ammount <= 0) {
        await message.react('🚫');
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.ammountZeroError[0]}**`)
        await message.channel.send(embed)
        return;
      }

      if (category == 'coins') {
        await updateDb(target, category, ammount);
      } else if (category == 'hrs') {
        await updateDb(target, 'minVoice', ammount * 60);
      }
      await message.react('☑');
      console.log(`[${message.guild.name}][REMOVE][SUCCES] removed ${ammount} coins from ${target.displayName}`);
      
    } catch (err) {
      console.log(`[${message.guild.name}][REMOVE][ERROR]`, err);
      return;
    }
  }
}