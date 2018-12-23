const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')


var creds = {
    client_email: process.env.client_email,
    private_key: process.env.private_key
}

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;


module.exports = {
    Add: async function(link) {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        await promisify(doc.useServiceAccountAuth)(creds)
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0]
        const cells = await promisify(sheet.getCells)({
            'min-row': 1,
            'max-row': 50,
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
    },
    ClearQueue: async function() {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        await promisify(doc.useServiceAccountAuth)(creds)
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0]

        const cells = await promisify(sheet.getCells)({
            'min-row': 1,
            'max-row': 50,
            'min-col': 1,
            'max-col': 1,
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
            'min-row': 1,
            'max-row': 50,
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

        const cells = await promisify(sheet.getCells)({
            'min-row': 1,
            'max-row': 50,
            'min-col': 1,
            'max-col': 1,
            'return-empty': true,
        })

        var queue = [];

        for (const cell of cells) {
            if (cell.value != "") {
                queue.push(cell.value);
            }
        }

        return queue;
    }
}