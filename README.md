<center>
<img align="left" src="https://cdn.discordapp.com/app-icons/523526679537385483/dd35370dfa397cbfb49e8e49fa0ae671.png?size=127.99">
<h1>The 3am Bot</h1>
Custom-made Discord bot for sending pictures to your guild at 3am
</center> 
</br>


___
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Requirements and Setup](#requirements-and-setup)
* [Execution](#execution)
* [Usage](#usage)

## General info
Have you ever felt like posting some questionable picture or link to your discord, but you  don't  hate  yourself and want to get at least some sleep? **The 3am Bot** is the best choice for you.

On the more serious note. Despite the fact that this custom made bot for my personal guild, you can replace all *process.env* fields with your values, and get it working for you as well.

|    process.env            | value                                        | example                                     |
| :------------------------:|:--------------------------------------------:| :------------------------------------------:|
| token                     | your discord bot token                       |  "rxemFITdW6U1hS5UAg..." **59 characters**  |
| channelID                 | ID of desired channel where to post stuff    |  "276834767074950983"                       |
| CLEARDB_DATABASE_HOSTNAME | Your SQL database hostname                   |  "eu-cdbr-west-03.cleardb.net"              |
| CLEARDB_DATABASE_USERNAME | Your SQL database username                   |  "a2p5xahps1o66o"                           |
| CLEARDB_DATABASE_PASSWORD | Your SQL database password                   |  "6qcs68ke"                                 |
| CLEARDB_DATABASE_NAME     | Your SQL database name                       |  "heroku_3ggjzio0gopxkrg"                   |
| serverID                  | Name of your SQL table (in my case guildID)  |  "311486195301120262"                       |

<img sizes="50%" src="https://i.imgur.com/mF1QRME.png">
<img sizes="50%" src="https://i.imgur.com/2JNK29j.png">

## Technologies
Project is created with:
* <a href="https://github.com/discordjs/discord.js" target="_blank">discord.js</a> - Discord API library
* <a href="https://www.heroku.com/" target="_blank">Heroku</a> - Hosting platform
* <a href="https://elements.heroku.com/addons/cleardb" target="_blank">ClearDB MySQL</a> - Heroku addon

## Requirements and Setup
* <a href="https://nodejs.org/en/" target="_blank">node.js</a> (requred dependencies are already preinstalled)
* MySQL database with table described below
```sql
CREATE TABLE `<process.env.serverID>` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_url` varchar(200) NOT NULL,
  `user_id` varchar(18) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

##### Don't forget to replace <process.env.serverID> with your own value.


## Execution and deployment
```
$ cd ../the-3am-bot
$ node app.js
```

In case you want to host this app on Heroku, the <a href="https://github.com/Tarasa24/the-3am-bot/blob/master/Procfile" target="_blank">Procfile</a> is already present. So only thing left to do is to deploy.

## Usage
All the communication is done through bots DMs. Simply send file or link, bot will handle the rest.

<img sizes="50%" src="https://i.imgur.com/tW9uXTn.png">
<img sizes="50%" src="https://i.imgur.com/x72bCd6.png">