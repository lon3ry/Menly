const Discord = require('discord.js');
const GuildSchema = require('../schemas/guild-schema.js');
const MemberSchema = require('../schemas/member-schema.js');
const MuteShema = require('../schemas/mute-schema.js');
const CounterShema = require('../schemas/counter-schema.js');
const ShopSchema = require('../schemas/shop-schema.js');
const DailySchema = require('../schemas/daily-schema.js');



module.exports = (bot) => {
  bot.on('guildCreate', async (guild) => {
    const guildData = new GuildSchema({
      guildId: `${guild.id}`,
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
    await GuildSchema.deleteOne({ guildId: `${guild.id}` });
    await MemberSchema.deleteMany({ guildId: `${guild.id}` });
    await CounterShema.deleteOne({ guildId: `${guild.id}` });
    await ShopSchema.deleteOne({ guildId: `${guild.id}` });
    await MuteShema.deleteMany({ guildId: `${guild.id}` });
    await DailySchema.deleteMany({ guildId: `${guild.id}` });
    await bot.user.setPresence({
      status: 'online',
      activity: {
        name: `за ${bot.guilds.cache.size} серверами | !invite`,
        type: 'WATCHING',
      }
    });
  });

  bot.on('guildMemberRemove', async (member) => {
    await MemberSchema.deleteOne({ guildId: `${member.guild.id}`, userId: `${member.id}` });
  });
}