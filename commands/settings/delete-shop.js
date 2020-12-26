const Discord = require('discord.js');
const ShopSchema = require('../../schemas/shop-schema.js');

module.exports = {
  commands: ['deleteshop', 'delete-shop', 'delete_shop'],
  group: 'Settings',
  description: 'Изменяет настройки магазина коинов',
  usage: 'role <@role> <price>\nsetshop description <text>\nsetshop removeroles <true / false>',
  permissionError: 'недостаточно прав',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, text, bot) => {
    try {
      
      const category = args[0];
      const data = await ShopSchema.findOne({ guildId: `${message.guild.id}` });
      
      if (data == null) {
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, **магазин ролей ещё не создан!**`)
        await message.channel.send(embed);
        return;
      }

      if (category == 'role') {
        if (args[1] == undefined) {
          const embed = new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor('0085FF')
            .setDescription(`:no_entry_sign: ${message.author} укажите роль, которую нужно удалить с магазина`)
          await message.channel.send(embed).then(message => { message.delete({ timeout: 5 * 1000 }) });
          return;
        }

        const roleToDelete = message.mentions.roles.first();
        const { roles } = await ShopSchema.findOne({ guildId: `${message.guild.id}` });

        if (roles == null) {
          return;
        }
        
        await ShopSchema.updateOne({ 
          guildId: `${message.guild.id}` 
        }, {
          $pull: {
            roles: {
              id: `${roleToDelete.id}`
            }
          }
        });

        await ShopSchema.deleteOne({ guildId: `${message.guild.id}`} );
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:ballot_box_with_check: Роль ${roleToDelete} успешно удалена с магазина`)
        await message.channel.send(embed);

        console.log(`[${message.guild.name}][DELETE-SHOP][SUCCES] role with name ${roleToDelete.name} deleted from shop`);

      } else if (category == 'all') {
        await ShopSchema.deleteOne({ guildId: `${message.guild.id}`} );
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:ballot_box_with_check: ${message.author}, магазин успешно удалён`)
        await message.channel.send(embed);
        console.log(`[${message.guild.name}][DELETE-SHOP][SUCCES] all shop deleted`);
      }

      await message.react('☑️');
      
    } catch {
      return;
    }
  }
}