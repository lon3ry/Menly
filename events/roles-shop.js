const Discord = require('discord.js');
const MemberSchema = require(`../schemas/member-schema.js`);
const ShopSchema = require('../schemas/shop-schema.js');


module.exports = async (bot) => {
  const Shop = async (reaction, user, category) => {
    const { message } = reaction;
    const { guild } = message;

    if (user.bot) {
      return;
    }

    const { message: ShopMessage, roles, config } = await ShopSchema.findOne({ guildId: `${guild.id}` });

    if (`${message.id}` == ShopMessage.id) {
      const numberEmoji = new Map()
        .set('1️⃣', 0)
        .set('2️⃣', 1)
        .set('3️⃣', 2)
        .set('4️⃣', 3)
        .set('5️⃣', 4)
        .set('6️⃣', 5)
        .set('7️⃣', 6)
        .set('8️⃣', 7)
        .set('9️⃣', 8)
        .set('🔟', 9)


      const reactionRoleData = await roles[numberEmoji.get(reaction.emoji.name)];
      const reactionRole = await guild.roles.cache.get(reactionRoleData.id);
      const target = await guild.members.cache.get(user.id);

      if (category == 'add') {
        if (target.roles.cache.has(reactionRole.id)) {
          return;
        }
        const { coins: targetCoins } = await MemberSchema.findOne({ guildId: `${guild.id}`, userId: `${target.id}` });

        if (targetCoins - reactionRoleData.price < 0) {
          const embed = new Discord.MessageEmbed()
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: ${target}, **у вас недосаточно коинов** для преобретения данной роли. У вас ${targetCoins}/${reactionRoleData.price}`);
          await target.send(embed);
          return;
        }

        await MemberSchema.findOneAndUpdate({ guildId: `${guild.id}`, userId: `${target.id}` }, {
          $inc: {
            coins: -reactionRoleData.price
          }
        });
        await target.roles.add(reactionRole);
        console.log(`[${guild.name}][ROLES-Shop] added role with name ${reactionRole.name} to ${target.displayName}`);

      } else if (category == 'remove') {
        if (!config.removeRoles) {
          return;
        }

        if (target.roles.cache.has(reactionRole.id)) {
          await MemberSchema.findOneAndUpdate({ guildId: `${guild.id}`, userId: `${target.id}` }, {
            $inc: {
              coins: reactionRoleData.price
            }
          });
          await target.roles.remove(reactionRole);
          console.log(`[${guild.name}][ROLES-Shop] removed role with name ${reactionRole.name} from ${target.displayName}`);
        }
      }
    }
  }

  bot.channels.cache.forEach(async (channel) => {
    try {
      await channel.messages.fetch()
    } catch (err) {
      return
    }
  });

  bot.on('messageReactionAdd', async (reaction, user) => {
    try {
      await Shop(reaction, user, 'add');
    } catch (err) {
      return;
    }
  });

  bot.on('messageReactionRemove', async (reaction, user) => {
    try {
      await Shop(reaction, user, 'remove');
    } catch (err) {
      return;
    }
  });
}
