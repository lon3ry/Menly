const Discord = require('discord.js');
const CounterSchema = require('../../schemas/counter-schema.js');

module.exports = {
  commands: ['counter', 'count'],
  group: 'Counter',
  description: 'Создание канала с подсчётом участников на сервере',
  usage: '',
  permissionError: 'недостаточно прав',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text, bot) => {
    try {

      const { guild } = message;
      const countChannel = await guild.channels.create(`👤 Members: ${guild.memberCount}`, {
        type: 'voice',
        // without category
      });

      const oldCounterData = await CounterSchema.findOne({guildId: `${guild.id}`}); // find old data

      if (!oldCounterData) { // if old data, update them, else - create
        const counterData = new CounterSchema({
          guildId: `${guild.id}`,
          membersChannel: {
            id: `${countChannel.id}`
          }
        });
        await counterData.save();
        return;

      } else if (oldCounterData) {
        await CounterSchema.findOneAndUpdate({
          guildId: `${guild.id}`
        }, {
          $set: {
            membersChannel: {
              id: `${countChannel.id}`
            }
          }
        });
      }
      await message.react('☑️'); // reacting to call if comand done

    } catch (err) {
      return;
    }
  }
}
