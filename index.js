const Discord = require('discord.js');
const bot = new Discord.Client();
const mongo = require(`./utils/mongo.js`);
const checkData = require('./utils/check-data.js');
const loadCommands = require('./commands/load-commands.js');
const loadFeatures = require('./features/load-features.js');
bot.config = require('./config.json');

bot.on('ready', async () => {
	console.log(`Successfully logged in as ${bot.user.tag}`);
	await mongo();
	await checkData(bot);
	loadCommands(bot);
	loadFeatures(bot);
	await bot.user.setPresence({
		status: 'online',
		activity: {
			name: `за ${bot.guilds.cache.size} серверами | !invite`,
			type: 'WATCHING',
		}
	});
});

bot.setMaxListeners(0);
bot.login(bot.config.token);
