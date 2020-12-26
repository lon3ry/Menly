const MemberSchema = require('../schemas/member-schema.js');
const GuildSchema = require('../schemas/guild-schema.js');

async function getCountStatus(member) {
  const inDbStatus = await MemberSchema.countDocuments({ userId: `${member.id}`, guildId: `${member.guild.id}` });
  if (inDbStatus == 0) {
    const memberData = new MemberSchema({
      userId: `${member.id}`,
      guildId: `${member.guild.id}`
    })
    await memberData.save();
  }
  const { countStatus } = await MemberSchema.findOne({ userId: `${member.id}`, guildId: `${member.guild.id}` });
  return countStatus;
}

async function checkGuild(guild) {
  const inDbStatus = await GuildSchema.countDocuments({ guildId: `${guild.id}` });
  if (inDbStatus == 0) {
    const guildData = new GuildSchema({
      guildId: `${guild.id}`,
      prefix: '!',
      afkChannel: `${guild.afkChannelID}`,
    })
    await guildData.save();
  }
}


module.exports = {
  getCountStatus: getCountStatus,
  checkGuild: checkGuild
}