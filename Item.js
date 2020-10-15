const db = require('./db')


class Item {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM items;', async function (err, rows) {
                const items = await Promise.all(rows.map(row => new Item(row)))

                resolve(items)
            })
        })



    }
    constructor(data) {
        const item = this
        item.name = data.name
        item.menu_id = data.id
        item.id = data.id
        item.price = data.price

        if (data.id) {
            return Promise.resolve(item)
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO items(name, menu_id, price) VALUES(?,?,?);', [this.name, this.menu_id, this.price], function (err) {
                    item.id = this.lastID
                    resolve(item)
                })
            })
        }
    }


}
module.exports = { Item }