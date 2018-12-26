const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')


var creds = {
    client_email: process.env.client_email,
    private_key: process.env.private_key
}

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;


module.exports = {
    Add: async function(link, author, author_icon) {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        await promisify(doc.useServiceAccountAuth)(creds)
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0]
        const cells = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 1,
            'max-col': 1,
            'return-empty': true,
        })
        for (const cell of cells) {
            if (cell.value === "") {
                cell.value = link;
                await cell.save();
                break;
            }
        }

        const cells_author = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 2,
            'max-col': 2,
            'return-empty': true,
        })

        for (const cell of cells_author) {
            if (cell.value === "") {
                cell.value = author;
                await cell.save();
                break;
            }
        }

        const cells_icon = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 3,
            'max-col': 3,
            'return-empty': true,
        })

        for (const cell of cells_icon) {
            if (cell.value === "") {
                cell.value = author_icon;
                await cell.save();
                break;
            }
        }
    },
    ClearQueue: async function() {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        await promisify(doc.useServiceAccountAuth)(creds)
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0]

        const cells = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 1,
            'max-col': 3,
            'return-empty': true,
        })

        for (const cell of cells) {
            if (cell.value != "") {
                cell.value = "";
                await cell.save();
            }
        }
    },
    QueueLength: async function() {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        await promisify(doc.useServiceAccountAuth)(creds)
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0]

        const cells = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 1,
            'max-col': 1,
            'return-empty': true,
        })

        var count = 0;

        for (const cell of cells) {
            if (cell.value != "") {
                count += 1;
            }
        }

        return count;
    },
    GetQueue: async function() {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        await promisify(doc.useServiceAccountAuth)(creds)
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0]

        var queue = {"link": [], "username": [], "icon": []}

        const cells = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 1,
            'max-col': 1,
            'return-empty': true,
        })
        for (const cell of cells) {
            if (cell.value != "") {
                queue.link.push(cell.value);
            } else {
                break;
            }
        }

        const cells_author = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 2,
            'max-col': 2,
            'return-empty': true,
        })

        for (const cell of cells_author) {
            if (cell.value != "") {
                queue.username.push(cell.value);
            } else {
                break;
            }
        }

        const cells_icon = await promisify(sheet.getCells)({
            'min-row': 2,
            'max-row': 51,
            'min-col': 3,
            'max-col': 3,
            'return-empty': true,
        })

        for (const cell of cells_icon) {
            if (cell.value != "") {
                queue.icon.push(cell.value);
            } else {
                break;
            }
        }

        return queue;
    }
}