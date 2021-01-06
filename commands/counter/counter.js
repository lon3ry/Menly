const Discord = require('discord.js');
const CounterSchema = require('../../schemas/count-channel-schema.js');

module.exports = {
  commands: ['counter', 'count'],
  group: 'Counter',
  description: 'Создание канала с подсчётом участников на сервере',
  usage: '',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text, commandText, bot) => {
    try {

      const { guild } = message;
      const countChannel = await guild.channels.create(`👤 Members: ${guild.memberCount}`, {
        type: 'voice'
      });

      const oldCounterData = await CounterSchema.findOne({guildID: `${guild.id}`}); // find old data

      if (!oldCounterData) { // if old data, update them, else - create
        const counterData = new CounterSchema({
          guildID: `${guild.id}`,
          membersChannel: {
            id: `${countChannel.id}`
          }
        });
        await counterData.save();
        return;

      } else if (oldCounterData) {
        await CounterSchema.findOneAndUpdate({
          guildID: `${guild.id}`
        }, {
          $set: {
            membersChannel: {
              id: `${countChannel.id}`
            }
          }
        });
      }
      await message.react('☑️'); // reacting to call if comand done
      console.log(`[${message.guild.name}][COUNTER] counter created/updated`)

    } catch (err) {
      console.log(`[${message.guild.name}][ERROR]`, err)
      return;
    }
  }
}
