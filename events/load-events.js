const fs = require('fs');
const path = require('path');
module.exports = (bot) => {
  const loadEvents = (dir, bot) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      if (file !== 'load-events.js') {
        console.log(`[+][event] ${file}`);
        const event = require(path.join(__dirname, dir, file));
        event(bot);
      }
    }
  }
  loadEvents(`.`, bot);
}