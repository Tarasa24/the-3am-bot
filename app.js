const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
  	var msgDate = msg.createdAt;
  	var sysDate = Date.now();
    msg.reply(`Latency: ${sysDate - msgDate}ms`);
  }
});

client.login(token);