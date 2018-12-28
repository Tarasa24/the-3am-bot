var mysql = require('mysql');

var pool = mysql.createPool({
    host: process.env.CLEARDB_DATABASE_HOSTNAME,
    user: process.env.CLEARDB_DATABASE_USERNAME,
    password: process.env.CLEARDB_DATABASE_PASSWORD,
    database: process.env.CLEARDB_DATABASE_NAME
});

var serverID = process.env.serverID;
module.exports = {
    Add: function(link, author_id) {
        pool.getConnection(function(err, con) {
            var sql = `INSERT INTO \`${serverID}\`(\`file_url\`, \`user_id\`) VALUES ("${link}","${author_id}");`
            con.query(sql, function(err) {
                if (err) throw err;
                con.release();
            });
        });
    },
    ClearQueue: function() {
        pool.getConnection(function(err, con) {
            var sql = `DELETE FROM \`${serverID}\`;`
            con.query(sql, function(err) {
                if (err) throw err;
                con.release();
            });
        });
    },
    QueueLength: async function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, con) {
                var sql = `SELECT COUNT(*) FROM \`${serverID}\`;`
                con.query(sql, function(err, result) {
                    if (err) throw err;
                    resolve(result[0]["COUNT(*)"]);
                    con.release();
                });
            });
        });
    },
    GetQueue: async function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, con) {
                var queue = { "link": [], "user_id": [] };
                var sql = `SELECT * FROM \`${serverID}\`;`
                con.query(sql, function(err, result) {
                    if (err) throw err;
                    for (e in result) {
                        queue.link.push(result[e].file_url)
                        queue.user_id.push(result[e].user_id)
                    }
                    resolve(queue);
                    con.release();
                });
            });
        });
    }
}