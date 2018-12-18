// init ;p
const time = Date(),
pak = require('./package.json'),
discord = require('discord.js'),
config = require('./json/config.json'),
profanities = require("./profanities.json"),
bot = new discord.Client()
var prefix = process.env.prefix,
{baselogger} = require('./src/logger.js'),
result = Math.round(Math.random()),
updates = ["Work command added.", "MongoDB is now Hulkbot's official database provider."],
webhookchannelid = "441710517460008960",
cleverbot = require('cleverbot.io'),
ms = require('ms'),
snekfetch = require('snekfetch'),
cb = new cleverbot("sMNApmkOjMlZRlPZ", "gskxw3JBqEVGIAboBjOnvyTf8awM1MbS")
config.updates = updates.join(' ')
require('mongoose').connect(`mongodb+srv://Hulkbot:${process.env.mongopassword}@hulkbot-2fias.gcp.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true })
const gdata = require('./database/mongoose/GuildData')
// End of init

// The bot's support server invite vvv
bot.invite = "https://discord.gg/UpjCWx9"
// No more invite.

// Gather commands
bot.commands = new discord.Collection();

process.on('unhandledRejection', (reason, promise) => {
  console.log(new Error(reason))
})

require('fs').readdir("./commands/", (err, files) => {
  console.log("Loading commands...");
  if (err) return console.log(`Command loading failed!`);
  files.filter(f => f.split(".").pop() === "js").forEach((f, i) => {
    bot.commands.set(require(`./commands/${f}`).help.name, require(`./commands/${f}`));
  });
});

bot.on("ready", () => {
  require('./util/poststats.js')(bot)
  require('./util/consoles.js')(bot, config)
  bot.user.setActivity("Loading Hulkbot...", {type: "STREAMING", url: "https://twitch.tv/freakinghulk"})
  // Post bot stats
  snekfetch.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
    .set('Authorization', process.env.tok)
    .send({ server_count: bot.guilds.size })
    .then(() => console.log('Updated discordbots.org stats.'))
    .catch(err => console.error(`Whoops something went wrong: ${err.body}`));
  
  setTimeout(() => {
    bot.user.setActivity(`for h!help | ${bot.guilds.array().length} servers`, {type: "WATCHING"});
  }, 20000)

  bot.guilds.forEach((guild, id) => {
    console.log(`[SERVER] [${guild.memberCount}] ${guild.name} (${guild.id}) | Joined: ${guild.joinedAt.toString()}\n`)
  });
});
bot.on('error', (err) => {
  console.error(`Error... ${err}`).then(() => {
    bot.destroy().then(() => {
      bot.login(process.env.botToken)
    })
  })
})
bot.on("guildMemberAdd", (member) => require('./events/guildMemberAdd.js')(bot, member))
bot.on("guildMemberRemove", (member) => require('./events/guildMemberRemove.js')(bot, member))
// bot.on("guildBanAdd", (guild, member) => require('./events/BanAdd.js')(bot, guild, member))
bot.on("guildBanRemove", (guild, member) => require('./events/BanRemove.js')(bot, guild, member))
 
bot.on("message", message => {
  var mentionedmember = message.mentions.members.first()
  gdata.findOne({guildId: message.guild.id}, (err,data) => {
    if (data == null) {
      const newG = new gdata({
        guildId: message.guild.id,
        prefix: "m!",
        isPremium: false,
        welcome: null,
        modlog: null,
        isBL: false
      })
      newG.save()
      prefix = newG.prefix
    } else {
      prefix = data.prefix
    }
  })
  
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.channel.type == "dm") return;

  let mArray = message.content.split(" ");
  let args = mArray.slice(1);
  let loggedcmd = mArray[0].slice(prefix.length)

  let cmd = bot.commands.get(loggedcmd);
  if (message.author.bot) return;

  if (cmd) {
      if (config.userblacklist.includes(message.author.id)) return;
      cmd.run(bot, message, args, discord)
      console.log(`${message.author.username} used the ${loggedcmd} command.`);
      baselogger(bot, `**Command Run**\n\n**Command:** ${loggedcmd}\n**User:** ${message.author.tag}\n**Message:** ${message.content}\n**Guild:** ${message.guild.name}\n**Channel:** ${message.channel.name}`);
  } 
    if (message.content == "i love you musical") {
    message.channel.send("oh god, not another one");
  }
  
  if (message.isMentioned("294194506113220608")) {
    const em = new discord.RichEmbed()
    .setTitle(`Musical Intro`)
    .setDescription(`Hey! Welcome to my intro! For help, use m!help! For info about me, use m!info!`)
    .setColor("GREEN")
    .setTimestamp()
    console.log('lol')
    message.channel.send({embed: em})
  }
 });
      
bot.on("guildCreate", (guild) => {
  require('./events/guildCreate.js')(bot, guild, discord)
  baselogger(bot, `**Guild Join**\n\n**Guild:** ${guild.name}\n**Owner:** ${guild.owner.user.username}\n**Large:** ${guild.large}\n**Member Count:** ${guild.memberCount}\n\n**Total Guilds:** ${bot.guilds.array().length}`, guild.iconURL);
});

bot.on("guildDelete", (guild) => {
  require('./events/guildDelete.js')(bot, guild, discord)
  baselogger(bot, `**Guild Leave**\n\n**Guild:** ${guild.name}\n**Owner:** ${guild.owner.user.username}\n**Large:** ${guild.large}\n**Member Count:** ${guild.memberCount}\n\n**Total Guilds:** ${bot.guilds.array().length}`, guild.iconURL);
});

bot.login(process.env.botToken); 

let upmsg = `Oh yeah, more updates! New updates:\n${updates}`
  async function senddat(up,msg) {
    if (up == null) return;
   await bot.channels.get('521749375714721815').send(msg).then(() => {
     up.pop(up)
   })
   await bot.channels.get('521749375714721815').send(msg).then(() => {
     up.pop(up)
   })
  }
exports.date = time
exports.bot = bot
exports.updates = updates.join(" ")
exports.sendupdates = senddat
