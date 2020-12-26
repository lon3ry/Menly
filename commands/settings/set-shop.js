const Discord = require('discord.js');
const ShopSchema = require('../../schemas/shop-schema.js');

module.exports = {
  commands: ['setshop', 'set-shop'],
  group: 'Settings',
  description: 'Изменяет настройки магазина коинов',
  usage: 'role <@role> <price>\nsetshop description <text>\nsetshop removeroles <true / false>',
  permissionError: 'недостаточно прав',
  minArgs: 3,
  maxArgs: null,
  callback: async (message, args, text, bot) => {
    try {

      const category = args[0];
      if (category == 'role') {
        const data = await ShopSchema.findOne({ guildId: `${message.guild.id}` });
        if (data != null && data.roles.length + 1 > 10) {
          let embed = new Discord.MessageEmbed()
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: ${message.author}, **установлено максимальное количество ролей в магазине!** Вы можете удалить старые роли и добавить новые с помощью команд категории \`\`shop\`\``)
          await message.author.send(embed);
          return;
        }

        const price = args[2];
        const role = message.mentions.roles.first();
        await ShopSchema.findOneAndUpdate({ guildId: `${message.guild.id}` }, {
          $push: {
            roles: {
              id: `${role.id}`, price: price
            }
          }
        }, { upsert: true, new: true });
        console.log(`[${message.guild.name}][SET-SHOP][SUCCES] role ${role.name} successfully added to shop with price ${price}`);

      } else if (category == 'description') {
        const shopText = text.replace('description ', '');
        const result = await ShopSchema.findOneAndUpdate({ guildId: `${message.guild.id}` }, {
          $set: {
            message: {
              description: shopText
            }
          }
        }, { upsert: true, new: true });
        console.log(`[${message.guild.name}][SET-SHOP][SUCCES] description set to ${shopText}`, result);

      } else if (category == 'removeroles') {
        const status = args[1];
        const result = await ShopSchema.findOneAndUpdate({ guildId: `${message.guild.id}` }, {
          $set: {
            config: {
              removeRoles: status
            }
          }
        }, { upsert: true, new: true });
        console.log(`[${message.guild.name}][SET-SHOP][SUCCES] removeroles status set to ${status}`);
      }
      await message.react('☑️');
      
    } catch {
      return;
    }
  }
}