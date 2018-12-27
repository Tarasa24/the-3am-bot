var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.CLEARDB_DATABASE_HOSTNAME,
    user: process.env.CLEARDB_DATABASE_USERNAME,
    password: process.env.CLEARDB_DATABASE_PASSWORD,
    database: process.env.CLEARDB_DATABASE_NAME
});

var serverID = process.env.serverID;

con.connect(function(err) { if (err) throw err; });

module.exports = {
    Add: function(link, author_id) {
        var sql = `INSERT INTO \`${server_id}\`(\`file_url\`, \`user_id\`) VALUES ("${link}","${author_id}");`
        con.query(sql, function(err) {
            if (err) throw err;
            
        });
    },
    ClearQueue: function() {
        var sql = `DELETE FROM \`${server_id}\`;`
        con.query(sql, function(err) {
            if (err) throw err;
            
        });
    },
    QueueLength: async function() {
        return new Promise(function(resolve, reject) {
            var sql = `SELECT COUNT(*) FROM \`${server_id}\`;`
            con.query(sql, function(err, result) {
                if (err) throw err;
                resolve(result[0]["COUNT(*)"]);
            });
        });
    },
    GetQueue: async function() {
        return new Promise(function(resolve, reject) {
            var queue = { "link": [], "user_id": [] };
            var sql = `SELECT * FROM \`${server_id}\`;`
            con.query(sql, function(err, result) {
                if (err) throw err;
                for (e in result) {
                    queue.link.push(result[e].file_url)
                    queue.user_id.push(result[e].user_id)
                }
                resolve(queue);
            });
        })
    }
}