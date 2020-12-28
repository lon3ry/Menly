const MemberSchema = require(`../schemas/member-schema.js`);
const GuildSchema = require(`../schemas/guild-schema.js`);
const { getCountStatus, startCount, stopCount } = require('../utils/voicefunc.js');

module.exports = (bot) => {
  bot.on('voiceStateUpdate', async (oldState, newState) => {
    const member = oldState.member;
    const countStatus = await getCountStatus(member);
    const { afkChannel } = await GuildSchema.findOne({ guildId: `${member.guild.id}` });

    if (countStatus == 'stop' || typeof countStatus === undefined) {
      if (!member.voice.selfMute) {
        if (oldState.channel && newState.channel) {
          const newStateMembers = newState.channel.members.array();
          if (oldState.channel === newState.channel) {
            if (newStateMembers.length - 1 >= 2 && newState.channel.id.toString() !== afkChannel) {
              await startCount(member);
            } else if (newStateMembers.length >= 2 && newState.channel.id.toString() !== afkChannel) {
              for (const member of newStateMembers) {
                await startCount(member);
              }
            }
          } else if (oldState.channel !== newState.channel) {
            if (newStateMembers.length >= 2 && newState.channel.id.toString() !== afkChannel) {
              for (const member of newStateMembers) {
                await startCount(member);
              }
            }
          }
        } else {
          if (!oldState.channel) {
            const newStateMembers = newState.channel.members.array();
            if (newStateMembers.length - 1 >= 2 && newState.channel.id.toString() !== afkChannel) {
              await startCount(member);
            } else if (newStateMembers.length >= 2 && newState.channel.id.toString() !== afkChannel) {
              for (const member of newStateMembers) {
                await startCount(member);
              }
            }
          }
        }
      }
    } else if (countStatus == 'start') {
      if (oldState.channel && newState.channel) {

        // Getting members array
        const oldStateMembers = oldState.channel.members.array();
        const newStateMembers = newState.channel.members.array();
        
        if (oldState.channel === newState.channel) {
          if (member.voice.selfMute || newState.channel.id.toString() !== afkChannel) {
            if (newStateMembers.length - 1 >= 2) {
              await stopCount(member);
            } else if (newStateMembers.length - 1 < 2) {
              for (const member of newStateMembers) {
                await stopCount(member);
              }
            }
          }
        } else if (oldState.channel !== newState.channel) {
          if (newStateMembers.length < 2 || newState.channel.id.toString() !== afkChannel) {
            await stopCount(member);
            if (oldStateMembers.length - 1 < 2) {
              for (const member of oldStateMembers) {
                await stopCount(member);
              }
            }
          }
        }
      } else {
        try {
          const oldStateMembers = oldState.channel.members.array();
          if (!newState.channel) {
            await stopCount(member);
            if (oldStateMembers.length - 1 < 2) {
              for (const member of oldStateMembers) {
                await stopCount(member);
              }
            }
          }
          else {
            if (newState.channel.id.toString() === afkChannel) {
              await stopCount(member);
            }
          }
        } catch (err) {
          console.log(`[${oldState.guild.name}][VOICE-COUNT][ERROR]`, err);
        }
      }
    }
  });
}