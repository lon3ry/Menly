const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  const baseFile = 'command-base.js';
  const commandBase = require(`./${baseFile}`);

  const commands = [];

  const loadCommands = dir => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) { 
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        loadCommands(path.join(dir, file));
      } else if (file !== baseFile && file !== 'load-commands.js') {
        const option = require(path.join(__dirname, dir, file));
        commands.push(option);
        if (bot) {
          commandBase(bot, option);
        }

      }
    }
  }
  loadCommands(`.`);
  return commands;
}