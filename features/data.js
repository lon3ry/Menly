const Discord = require('discord.js');
const GuildSchema = require('../schemas/guild-schema.js');
const MemberSchema = require('../schemas/member-schema.js');
const MuteShema = require('../schemas/mute-schema.js');
const CounterShema = require('../schemas/count-channel-schema.js');
const RolesShopSchema = require('../schemas/roles-shop-schema.js');
const DailySchema = require('../schemas/daily-schema.js');



module.exports = (bot) => {
  bot.on('guildCreate', async (guild) => {
    const guildData = new GuildSchema({
      guildID: `${guild.id}`,
      prefix: '!',
      afkChannel: `${guild.afkChannelID}`,
    });

    guildData.save();
    await bot.user.setPresence({
      status: 'online',
      activity: {
        name: `за ${bot.guilds.cache.size} серверами | !invite`,
        type: 'WATCHING',
      }
    });
  });

  bot.on('guildDelete', async (guild) => {
    await GuildSchema.deleteOne({ guildID: `${guild.id}` });
    await MemberSchema.deleteMany({ guildID: `${guild.id}` });
    await CounterShema.deleteOne({ guildID: `${guild.id}` });
    await RolesShopSchema.deleteOne({ guildID: `${guild.id}` });
    await MuteShema.deleteMany({ guildID: `${guild.id}` });
    await DailySchema.deleteMany({ guildID: `${guild.id}` });
    await bot.user.setPresence({
      status: 'online',
      activity: {
        name: `за ${bot.guilds.cache.size} серверами | !invite`,
        type: 'WATCHING',
      }
    });
  });

  bot.on('guildMemberRemove', async (member) => {
    await MemberSchema.deleteOne({ guildID: `${member.guild.id}`, userID: `${member.id}` });
  });
}