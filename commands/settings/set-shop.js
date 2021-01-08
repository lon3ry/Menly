const Discord = require('discord.js');
const RolesShopSchema = require('../../schemas/roles-shop-schema.js');

module.exports = {
  commands: ['set-shop', 'setshop', 'set-roles-shop'],
  group: 'Settings',
  description: 'Editing roles-shop\'s settings',
  usage: 'role <@role> <price>\nsetshop description <text>\nsetshop removeroles <true / false>',
  minArgs: 3,
  maxArgs: null,
  callback: async (message, args, text, commandText, bot) => {
    try {

      const category = args[0];
      if (category == 'role') {
        const data = await RolesShopSchema.findOne({ guildID: `${message.guild.id}` });
        
        if (data == null) {
          await message.react('🚫');
          let embed = new Discord.MessageEmbed()
            .setColor('E515BD')
            .setDescription(`:no_entry_sign: ${message.author}, **${commandText.noDataFoundError}**`)
          await message.author.send(embed);
        }
        
        if (data != null && data.roles.length + 1 > 10) {
          await message.react('🚫');
          let embed = new Discord.MessageEmbed()
            .setColor('E515BD')
            .setDescription(`:no_entry_sign: ${message.author}, **${commandText.maxShopRolesError}**`)
          await message.author.send(embed);
          return;
        }

        const price = args[2];
        const role = message.mentions.roles.first();
        await RolesShopSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, {
          $push: {
            roles: {
              id: `${role.id}`, price: price
            }
          }
        }, { upsert: true, new: true });
        console.log(`[${message.guild.name}][SET-SHOP][SUCCES] role ${role.name} successfully added to shop with price ${price}`);

      } else if (category == 'description') {
        const rolesShopText = text.replace('description ', '');
        const result = await RolesShopSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, {
          $set: {
            message: {
              description: rolesShopText
            }
          }
        }, { upsert: true, new: true });
        console.log(`[${message.guild.name}][SET-SHOP][SUCCES] description set to ${rolesShopText}`, result);

      } else if (category == 'removeroles') {
        
        const status = args[1];
        const result = await RolesShopSchema.findOneAndUpdate({ guildID: `${message.guild.id}` }, {
          $set: {
            config: {
              removeRoles: status
            }
          }
        }, { upsert: true, new: true });
        console.log(`[${message.guild.name}][SET-SHOP][SUCCES] removeroles status set to ${status}`, result);
      }
      await message.react('☑️');
      
    } catch (err) {
      console.log(`[${message.guild.name}][SET-SHOP][ERROR]`, err);
      return;
    }
  }
}