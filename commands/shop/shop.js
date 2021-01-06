const Discord = require('discord.js');
const RolesShopSchema = require('../../schemas/roles-shop-schema.js');

module.exports = {
  commands: ['shop', 'roles-shop', 'rolesshop'],
  group: 'Shop',
  description: 'Магазин ролей',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text, commandText, bot) => {
    try {
      
      const RolesShopData = await RolesShopSchema.findOne({ guildID: `${message.guild.id}` });

      if (!RolesShopData) {
        await message.delete(message);
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.noShopRolesError}**`)
        await message.channel.send(embed);
        return;
      }

      const { message: RolesShopMessage, roles } = RolesShopData;

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
        rolesText += `<@&${role.id}>\n${numberEmoji.get(counter)}**\`\`${role.price} ${commandText.priceName}\`\`**\n \n`;
        counter++;
      }

      const embed = new Discord.MessageEmbed()
        .setTitle(commandText.succes.name)
        .setColor('E515BD')
        .setDescription(`${RolesShopMessage.description}\n \n${rolesText}`)
        
      await message.delete(message);
      const botMessage = await message.channel.send(embed);
      for (let reacted = 1; reacted < counter; reacted++) {
        await botMessage.react(`${numberEmoji.get(reacted)}`)
      }
      
      await RolesShopSchema.findOneAndUpdate({guildID: `${message.guild.id}`}, {
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