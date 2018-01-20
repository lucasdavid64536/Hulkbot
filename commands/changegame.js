const config = require('../config.json')
const oid = process.env.oid

module.exports.run = (bot, message, args, discord) => {
 
 if (message.author.id == oid) {
 if (!args) return message.channel.send(`:ok_hand: Okay, I will set my playing status back to normal!`)
 var game = args.join(' ').split(2)
 bot.user.setActivity(`${game}`, {type: args[2]})
 message.channel.send(`:ok_hand: Okay, I will set my playing status to ${game}!`)
} else {
  message.channel.send("Nope!")
} 
}

module.exports.help = {
  name: "changegame",
  usage: ``,
  information: ""
}
