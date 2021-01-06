
const Discord = require('discord.js');
const CounterSchema = require('../../schemas/count-channel-schema.js');

module.exports = {
  commands: ['set-counter', 'setcounter', 'set_counter'],
  group: 'Settings',
  description: 'Изменение настроек канала со статистикой',
  usage: 'name <name>',
  minArgs: 2,
  maxArgs: null,
  callback: async (message, args, text, commandText, bot) => {
    try {

      const { guild } = message;
      const category = args[0];
      const data = await CounterSchema.findOne({ guildID: `${message.guild.id}` }); // find data

      if (!data) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.noDataFoundError}**`)
        await message.channel.send(embed);
        return;
      }

      if (category == 'name') {
        const channelName = args[1];
        const { membersChannel: channelData } = data;
        const channel = await guild.channels.cache.get(channelData.id);
        await channel.setName(`${channelName}: ${guild.memberCount}`);

        const result = await CounterSchema.findOneAndUpdate({
          guildId: `${message.guild.id}`
        }, {
          $set: {
            membersChannel: {
              id: `${channelData.id}`,
              name: `${channelName}`
            }
          }
        }); // update db
        await message.react('☑️');
        console.log(`[${guild.name}][SET-COUNTER][SUCCES] counter name set to ${channelName}`, result);
      }
    } catch (err) {
      return;
    }
  }
}
