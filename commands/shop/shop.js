const Discord = require('discord.js');
const ShopSchema = require('../../schemas/shop-schema.js');

module.exports = {
  commands: ['shop', 'roles-shop', 'rolesshop'],
  group: 'Shop',
  description: 'Магазин ролей',
  usage: '',
  permissionError: 'недостаточно прав',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text, bot) => {
    try {
      
      const ShopData = await ShopSchema.findOne({ guildId: `${message.guild.id}` });

      if (!ShopData) {
        await message.delete(message);
        const embed = new Discord.MessageEmbed()
          .setColor('0085FF')
          .setDescription(`:no_entry_sign: ${message.author}, **роли в магазине не заданы!** Задайте их с помощью команды \`\`!setShop role <@role>\`\``)
        await message.channel.send(embed);
        return;
      }

      const { message: ShopMessage, roles } = ShopData;

      let numberEmoji = new Map()
        .set(1, '1️⃣')
        .set(2, '2️⃣')
        .set(3, '3️⃣')
        .set(4, '4️⃣')
        .set(5, '5️⃣')
        .set(6, '6️⃣')
        .set(7, '7️⃣')
        .set(8, '8️⃣')
        .set(9, '9️⃣')
        .set(10, '🔟')

      let rolesText = '';
      let counter = 1;


      for (role of roles) {
        rolesText += `<@&${role.id}>\n${numberEmoji.get(counter)}**\`\`${role.price} коинов\`\`**\n \n`;
        counter++;
      }

      const embed = new Discord.MessageEmbed()
        .setTitle('Магазин ролей')
        .setColor('0085FF')
        .setDescription(`${ShopMessage.description}\n \n${rolesText}`)
        
      await message.delete(message);
      const botMessage = await message.channel.send(embed);
      for (let reacted = 1; reacted < counter; reacted++) {
        await botMessage.react(`${numberEmoji.get(reacted)}`)
      }
      
      await ShopSchema.findOneAndUpdate({guildId: `${message.guild.id}`}, {
        $set: {
          message: {
            id: `${botMessage.id}`
          }
        }
      });

    } catch (err) {
      console.log(err);
      return;
    }
  }
}