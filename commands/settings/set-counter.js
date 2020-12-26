const Discord = require('discord.js');
const CounterSchema = require('../../schemas/counter-schema.js');

module.exports = {
  commands: ['setcounter', 'set-counter', 'set_counter'],
  group: 'Settings',
  description: 'Изменение настроек канала со статистикой',
  usage: 'name <name>',
  permissionError: 'недостаточно прав',
  minArgs: 2,
  maxArgs: null,
  callback: async (message, args, text, bot) => {
    try {

      const { guild } = message;
      const category = args[0];
      const data = await CounterSchema.findOne({ guildId: `${message.guild.id}` }); // find data

      if (!data) {
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${author} канал с подсчётом пользователь не создан!`)
        await message.channel.send(embed);
        return;
      }

      if (category == 'name') {
        const channelName = args[1];
        const { membersChannel: channelData } = data;
        const channel = await guild.channels.cache.get(channelData.id);
        await channel.setName(`${channelName}: ${guild.memberCount}`);

        await CounterSchema.findOneAndUpdate({
          guildId: `${message.guild.id}`
        }, {
          $set: {
            membersChannel: {
              name: `${channelName}`
            }
          }
        }); // update db
        console.log(`[${guild.name}][SET-COUNTER][SUCCES] counter name set to ${channelName}`);
      }
      await message.react('☑️');
      
    } catch (err) {
      return;
    }
  }
}
