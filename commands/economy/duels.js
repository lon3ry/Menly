const Discord = require('discord.js');
const MemberSchema = require('../../schemas/member-schema.js');
class duelGame {
  reacted = false;

  constructor(bot, players, ammount, channel, commandText) {
    this._bot = bot;
    this._firstPlayer = players[0];
    this._secondPlayer = players[1];
    this._ammount = ammount;
    this._channel = channel;
    this._commandText = commandText;
  }

  async start() {
    const inviteMessage = await this.createInvite(this._firstPlayer, this._secondPlayer);
    await this.getInviteAnswer(inviteMessage);
  }

  async createInvite(creator, member) {
    const embed = new Discord.MessageEmbed()
      .setColor('E515BD')
      .setDescription(`${creator} ${this._commandText.invite.description[0]} **${this._ammount}** ${this._commandText.invite.description[1]}`)
      .setTitle(`:crossed_swords: ${this._commandText.embedName} :crossed_swords:`)
    const inviteMessage = await member.send(embed);
    await inviteMessage.react('☑️');
    await inviteMessage.react('❌');
    return inviteMessage;
  }

  async getInviteAnswer(inviteMessage) {
    this.reacted = false;
    this._bot.on('messageReactionAdd', async (reaction, user) => {
      if (this.reacted) {
        return;
      }

      if (user.bot) {
        return;
      }

      if (reaction.message.id != inviteMessage.id) {
        return;
      }

      if (reaction.emoji.name == '☑️') {
        await this.gameProcess();
        this.reacted = true;
        await inviteMessage.delete();
      } else if (reaction.emoji.name == '❌') {
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`${this._secondPlayer} ${this._commandText.inviteClose.description[0]}`)
          .setTitle(`:crossed_swords: ${this._commandText.embedName} :crossed_swords:`)
        await this._firstPlayer.send(embed);
        this.reacted = true;
        await inviteMessage.delete();
      }
    });
  }

  async getWinner() {
    let players = [this._firstPlayer, this._secondPlayer];
    let winner = players[Math.floor(Math.random() * players.length)];
    if (winner == this._firstPlayer) {
      return [winner, this._secondPlayer];
    } else {
      return [winner, this._firstPlayer];
    }
  }

  async gameProcess() {
    const results = await this.getWinner();
    const winner = results[0];
    const loser = results[1];
    await MemberSchema.updateOne({
      guildID: `${winner.guild.id}`, userID: `${winner.id}`
    }, {
      $inc: {
        coins: this._ammount
      }
    });

    await MemberSchema.updateOne({
      guildID: `${loser.guild.id}`, userID: `${loser.id}`
    }, {
      $inc: {
        coins: -this._ammount
      }
    });


    const embed = new Discord.MessageEmbed()
      .setColor('E515BD')
      .setDescription(`:trophy: ${winner} ${this._commandText.succes.description[0]} ${loser}. ${this._commandText.succes.description[1]} **${this._ammount}**`)
      .setTitle(`:crossed_swords: ${this._commandText.embedName} :crossed_swords:`)
    await this._channel.send(embed);
    return;
  }
}


module.exports = {
  commands: ['duels', 'flipduel', 'coinduel'],
  group: 'Economy',
  usage: '<@member> <ammount>',
  description: 'Duel vs server member',
  callback: async (message, args, text, commandText, bot) => {
    try {
      const target = message.mentions.members.first();
      const ammount = Math.trunc(args[1]);

      if (!target) {
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.errors.noTagUserError}**`)
          .setTitle(`:crossed_swords: ${this._commandText.embedName} :crossed_swords:`)
        await message.author.send(embed);
        return;
      }

      if (target == message.member) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.authorIsOpponentError}**`)
          .setTitle(`:crossed_swords: ${this._commandText.embedName} :crossed_swords:`)
        await message.author.send(embed);
        return;
      }

      let { coins: authorCoins } = await MemberSchema.findOne({ userID: `${message.author.id}`, guildID: `${message.guild.id}` });
      let { coins: targetCoins } = await MemberSchema.findOne({ userID: `${target.id}`, guildID: `${message.guild.id}` });

      if (authorCoins < ammount) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, **${commandText.inviterNoMoneyError[0]}** **${ammount}** ${commandText.inviterNoMoneyError[1]}`)
          .setTitle(':crossed_swords: Дуэль :crossed_swords:')
        await message.author.send(embed);
        return;
      }

      if (targetCoins < ammount) {
        await message.react('🚫');
        const embed = new Discord.MessageEmbed()
          .setColor('E515BD')
          .setDescription(`:no_entry_sign: ${message.author}, ${commandText.opposingNoMoneyError[0]} **${ammount}** ${commandText.opposingNoMoneyError[1]}`)
          .setTitle(':crossed_swords: Дуэль :crossed_swords:')
        await message.author.send(embed);
        return;
      }


      await new duelGame(bot, [message.member, target], ammount, message.channel, commandText).start();

    } catch (err) {
      console.log(`[${message.guild.name}][DUELS][ERROR]`, err);
      return;
    }
  }
}