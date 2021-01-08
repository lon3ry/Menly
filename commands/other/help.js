const Discord = require('discord.js');
const loadCommands = require('../load-commands.js');

module.exports = {
  commands: 'help',
  group: 'Other',
  description: 'Gives information about command',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const commands = loadCommands();

      if (!args[0]) {
        let embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setTitle('Help')
          .setFooter(commandText.succes.footer)
        let text = {};
        for (const command of commands) {
          const mainCommand = typeof command.commands === 'string'
            ? command.commands
            : command.commands[0]
          const usage = command.usage ? `${command.usage}` : ''
          const { description } = command;

          if (!text[`${command.group}`]) {
            text[`${command.group}`] = `${mainCommand} ${usage}\n`
          } else {
            text[`${command.group}`] += `${mainCommand} ${usage}\n`
          }
        }

        for (let key in text) {
          embed.addField(key, `\`\`\`\n${text[key]}\`\`\`\n`, false);
        }

        await message.author.send(embed);
        await message.delete(message);
        return;
      }

      for (command of commands) {
        const { usage, description } = command;
        const mainCommand = typeof command.commands === 'string'
          ? command.commands
          : command.commands[0]
        if (mainCommand === args[0]) {
          const usage = command.usage ? `${command.usage}` : '';
          let embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setColor('E515BD')
            .setDescription(`\`\`\`\n${mainCommand} ${usage}\`\`\`\n${description}`)
          await message.author.send(embed);
          await message.delete(message);
        }
      }

    } catch {
      return;
    }
  }
}