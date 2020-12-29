const MemberSchema = require('../schemas/member-schema.js');

async function getCountStatus(member) {
  const inDbStatus = await MemberSchema.countDocuments({ userID: `${member.id}`, guildID: `${member.guild.id}` });
  if (inDbStatus == 0) {
    const memberData = new MemberSchema({
      userID: `${member.id}`,
      guildID: `${member.guild.id}`
    })
    await memberData.save();
    return 'stop'
  }
  const { countStatus } = await MemberSchema.findOne({ userID: `${member.id}`, guildID: `${member.guild.id}` });
  return countStatus;
}

async function startCount(member) {
  let timeNow = new Date()
  const results = await MemberSchema.findOneAndUpdate(
    { userID: `${member.id}`, guildID: `${member.guild.id}` }, {
    $set: {
      timeJoin: timeNow,
      countStatus: 'start'
    }
  }, { new: true, upsert: true });
  console.log(`[${member.guild.name}][VOICECOUNT][SUCCES] started count for ${member.displayName}`, results);
}

async function stopCount(member) {
  const memberStats = await MemberSchema.findOne({ userID: `${member.id}`, guildID: `${member.guild.id}` });
  const { timeJoin } = memberStats;
  const timeNow = new Date();

  if (timeNow.getDate() - timeJoin.getDate() == 0) {
    if (timeNow.getHours() - timeJoin.getHours() == 0) {
      var timeAll = timeNow.getMinutes() - timeJoin.getMinutes();

    } else if (timeNow.getHours() - timeJoin.getHours() > 0) {
      var timeAll = (timeNow.getHours() - timeJoin.getHours()) * 60 + timeJoin.getMinutes();
    }

  } else if (timeNow.getDate() - timeJoin.getDate() != 0) {
    var timeAll = (24 * 60) - (timeJoin.getHours() * 60 + timeJoin.getMinutes()) + timeNow.getHours() * 60 + timeNow.getMinutes();
  }

  const results = await MemberSchema.findOneAndUpdate(
    { userID: `${member.id}`, guildID: `${member.guild.id}` }, {
    $inc: {
      coins: timeAll,
      minVoice: timeAll,
      xp: ~~(timeAll / 2)
    },
    $set: {
      countStatus: 'stop'
    }
  }, { new: true, upsert: true });
  console.log(`[${member.guild.name}][VOICECOUNT][SUCCES] stopped count for ${member.displayName}`, results);
}

module.exports = {
  startCount: startCount,
  stopCount: stopCount,
  getCountStatus: getCountStatus
}