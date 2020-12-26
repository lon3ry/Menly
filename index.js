const Discord = require('discord.js');
const bot = new Discord.Client();
const { checkGuild } = require('./utils/dbfuncs.js');
const mongo = require(`./utils/mongo.js`);
const loadCommands = require('./commands/load-commands.js');
const loadEvents = require('./events/load-events.js');
bot.config = require('./config.json');

bot.on('ready', async () => {
	console.log(`Successfully logged in as ${bot.user.tag}`);
	await mongo();
	loadCommands(bot);
	loadEvents(bot);
	await bot.user.setPresence({
		status: 'online',
		activity: {
			name: `за ${bot.guilds.cache.size} серверами | !invite`,
			type: 'WATCHING',
		}
	});

	bot.guilds.cache.forEach(async (guild) => {
		await checkGuild(guild)
	});
});

bot.setMaxListeners(0);
bot.login(bot.config.token);
