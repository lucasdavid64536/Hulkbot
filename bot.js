const discord = require('discord.js')
const config = require('./config.json')
const bot = new discord.Client()
const prefix = "h!"
const owner = "FreakingHulk Gaming#6545"
const dev2 = "RHG#0822"
const version = "0.1.1"

// Gather commands
bot.commands = new discord.Collection();

require('fs').readdir("./commands/", (err, files) => {
	console.log("Loading commands...")
  if (err) return console.log(`Command loading failed!`);
  files.filter(f => f.split(".").pop() === "js").forEach((f, i) => {
    bot.commands.set(require(`./commands/${f}`).help.name, require(`./commands/${f}`));
  })
})

bot.on("ready", () => {
 console.log("Bot is started. Get ready for some sweet commands!") 
 console.log("Bot name: " + bot.user.username + "bot")
 console.log("Bot owner: " + owner)
 console.log("Bot Dev 1: " + owner)
 console.log("Bot Dev 2: " + dev2)
bot.user.setGame("h!help | Hulkbot Version " + version + " Loaded!")
	
let status = ["Taking over the world", "Pizza is better", "Serving my owner", "You wouldn't like me when I'm angry."]
// Status Rotator
  gameval = 0
  setInterval(() => {
    if (gameval == status.length) {
      gameval = 0
    }
    var game = status[gameval]
    bot.user.setGame(`h!help | ${game}`)
    gameval++
  }, 60000) // One min
});

bot.on("message", message => {
    if (!message.content.startsWith(prefix)) return;
    if (message.content == prefix + "perms") {
     message.author.send("No permissions yet. Contact <@242734840829575169> for details.")
   console.log(message.author.username + " used the perms command.")
    }
    if (message.content == prefix + "invite") {
    message.channel.send("I can't use invite links. :frowning2: Here's an OAuth2 link instead! https://discordapp.com/oauth2/authorize?&client_id=294194506113220608&scope=bot&permissions=0")
    console.log(message.author.username + " used the invite command.") 
    }
   if (message.content == prefix + "joinserver") {
      message.reply("use this to join the help server: https://discord.gg/XvMA2rJ")
   }
 
  let mArray = message.content.split(" ");
  let args = mArray.slice(1);

  let cmd = bot.commands.get(mArray[0].slice(prefix.length));
   if(message.author.bot) return;
   if(message.channel.type === "dm") return
    
  if(cmd) {
    cmd.run(bot, message, args);
    console.log(message.author.username + " used the "+ message.content.split(" ")[0] +" command.");
   }
})

bot.on("message", (message) => {
    if (message.content.startsWith(prefix + "kick")) {
        // Easy way to get member object though mentions.
        var member= message.mentions.members.first();
        // Kick
        member.kick().then((member) => {
            // Successmessage
            message.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
        }).catch(() => {
             // Failmessage
            message.channel.send("Access Denied");
        });
    }
});

bot.login(process.env.botToken);

