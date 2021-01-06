const Discord = require('discord.js');
const RolesShopSchema = require('../../schemas/roles-shop-schema.js');

module.exports = {
  commands: ['delete-shop', 'deleteshop', 'delete_shop'],
  group: 'Settings',
  description: 'Изменяет настройки магазина коинов',
  usage: 'role <@role> <price>\nsetshop description <text>\nsetshop removeroles <status: true / false>',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const category = args[0];
      const data = await RolesShopSchema.findOne({ guildID: `${message.guild.id}` });
      
      if (data == null) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.noDataFoundError}**`)
        await message.channel.send(embed);
        return;
      }

      if (category == 'role') {
        if (args[1] == undefined) {
          await message.react('🚫');
          const embed = new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor('E515BD')
            .setDescription(`:no_entry_sign: ${message.author} ${commandText.errors.noTagRoleError}`)
          await message.channel.send(embed);
          return;
        }

        const roleToDelete = message.mentions.roles.first();
        const { roles } = await RolesShopSchema.findOne({ guildID: `${message.guild.id}` });

        if (roles == null) {
          return;
        }
        
        await RolesShopSchema.updateOne({ 
          guildID: `${message.guild.id}` 
        }, {
          $pull: {
            roles: {
              id: `${roleToDelete.id}`
            }
          }
        });

        await RolesShopSchema.deleteOne({ guildID: `${message.guild.id}`} );
        await message.react('☑️');
        console.log(`[${message.guild.name}][DELETE-SHOP][SUCCES] role with name ${roleToDelete.name} deleted from shop`);

      } else if (category == 'all') {
        await RolesShopSchema.deleteOne({ guildID: `${message.guild.id}`} );
        await message.react('☑️');
        console.log(`[${message.guild.name}][DELETE-SHOP][SUCCES] all shop deleted`);
      }

      await message.react('☑️');
      
    } catch {
      return;
    }
  }
}