const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

const spreadsheet = require('./spreadsheet.js');
var validUrl = require('valid-url');


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
                var successfull = 0
                var unsuccessfull = queue.link.length;

                for (var i = 0; i < unsuccessfull; i++) {
                    if (queue.link[i].slice(-5).indexOf(".") > 0) {
                        const embed = {
                            "color": 9442302,
                            "image": {
                                "url": queue.link[i]
                            },
                            "footer": {
                                "text": queue.username[i],
                                "icon_url": queue.icon[i]
                            }
                        };
                        channel.send({ embed })
                            .then(successfull += 1);


                    } else {
                        channel.send(queue.link[i])
                        const embed = {
                            "color": 16711680,
                            "footer": {
                                "text": queue.username[i],
                                "icon_url": queue.icon[i]
                            }
                        };
                        channel.send({ embed })
                    }
                }

                //log
                unsuccessfull -= successfull
                console.log(`==== ${successfull} files were successfully posted + ${unsuccessfull} links ====`)

                // Clearing the queue
                spreadsheet.ClearQueue()
                console.log("==== Queue cleared ====\n")

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
    client.user.setPresence({ game: { name: 'DM me' }, status: 'online' })
    console.log(`Logged in as ${client.user.tag}!`);
    scheduler();
});

client.on('message', msg => {
    if (msg.channel.type === "dm" && msg.author.bot == false) {
        if (msg.content === 'ping') {
            var msgDate = msg.createdAt;
            var sysDate = Date.now();
            msg.reply(`Latency: ${sysDate - msgDate}ms`);

        } else if (msg.content === 'queue') {
            spreadsheet.QueueLength()
                .then(count => {
                    msg.reply(`${count} link(s) currently in the queue`)
                });

        } else if (msg.content === 'uptime') {
            msg.reply(convertMS(client.uptime));

        } else {
            var author = msg.author.username
            var author_icon = msg.author.avatarURL
            msg.attachments.forEach(function(attachment) {
                spreadsheet.Add(attachment.url, author, author_icon)
                    .then(msg.reply("File was successfully added to the queue"))
                    .catch(err => {
                        console.error(err);
                    });
            })

            if (validUrl.isUri(msg.content)) {
                spreadsheet.Add(msg.content, author, author_icon)
                msg.reply("Link was successfully added to the queue")
            }
        }
    }
});

client.login(token);