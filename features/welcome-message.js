const Discord = require('discord.js');
const { getFeatureText } = require('../utils/language.js');


module.exports = (bot) => {
  bot.on('guildCreate', async (guild) => {
    try {
      
      const channel = await guild.channels.cache.filter((channel) => channel.type === 'text').first();
      const featureText = getFeatureText('english', 'welcome-message');
      const embed = new Discord.MessageEmbed()
        .setColor('E515BD')
        .setTitle(featureText.succes.name)
        .setDescription(featureText.succes.description)
      await channel.send(embed)

    } catch (err) {
      console.log('[FEATURE][WELCOME-MESSAGE]', err)
    }
  });
}