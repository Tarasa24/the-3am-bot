const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;
const prefix = "!";

const spreadsheet = require('./spreadsheet.js');

//update from spreadsheet
var queue = [];

function scheduler() {
    var sysDate = new Date();

    console.log("Local time: " + sysDate.toUTCString());
    offset = 1;
    if (sysDate.getHours() < 2) {
        offset = 0
    };
    sysDate.setDate(sysDate.getDate() + offset);
    sysDate.setHours(2);
    sysDate.setMinutes(0);
    sysDate.setSeconds(0);
    sysDate.setMilliseconds(0);
    console.log("Desired time: " + sysDate.toUTCString());

    delay = sysDate - Date.now()
    console.log("Timeout: " + delay + "ms")

    var channel = client.channels.get(process.env.serverID);

    setTimeout(function() {
        spreadsheet.GetQueue()
            .then(queue => {
                console.log(queue)
                queue.forEach(function(element) {
                    channel.send(element);
                });

                // Clearing the queue
                spreadsheet.ClearQueue()

                // Fixing negative timout calculation
                setTimeout(function() { scheduler() }, 2000);
            });


    }, delay);
};

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    var pad = function(n) { return n < 10 ? '0' + n : n; };

    var result = d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
    return result;
};


client.on('ready', () => {
    client.user.setPresence({ game: { name: '!add _link_' }, status: 'online' })
    console.log(`Logged in as ${client.user.tag}!`);
    scheduler();
});

client.on('message', msg => {
    list = msg.content.split(" ");
    if (list[0] === prefix + 'ping') {
        var msgDate = msg.createdAt;
        var sysDate = Date.now();
        msg.reply(`Latency: ${sysDate - msgDate}ms`);
    } else if (list[0] === prefix + 'queue') {
        if (msg.deletable) {
            msg.delete();
        }

        spreadsheet.QueueLength()
            .then(count => {
                msg.author.send(`${count} link(s) currently in the queue`)
            });

    } else if (list[0] === prefix + 'uptime') {
        msg.reply(convertMS(client.uptime));
    } else if (list[0] === prefix + 'add') {
        if (msg.deletable) {
            msg.delete();
        }

        if (list.length < 2) {
            msg.author.send("Wrong format...\n**Please use**\n```!add _link_```")
        } else {
            spreadsheet.AddLink(list[1])
                .then(response => {
                    if (response == true) {
                        msg.author.send("Your link was successfully added to the queue");
                    } else {
                        msg.author.send("An error has occured [**Queue is full**]");
                    }
                });
        }
    }
});

client.login(token);