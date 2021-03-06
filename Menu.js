const db = require('./db')
const {Item} = require('./Item')


class Menu {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM menus;', async function (err, rows) {
                const menus = await Promise.all(rows.map(row => new Menu(row)))
                resolve(menus)
            })
        })
    }
    constructor(data) {
        const menu = this
        menu.title = data.title
        menu.restaurant_id = data.restaurant_id
        menu.id = data.id
        menu.items = []

        if (data.id) {
            return Promise.resolve(menu)
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO menus(title, restaurant_id) VALUES(?,?);', [this.title, this.restaurant_id], function (err) {
                    menu.id = this.lastID
                    resolve(menu)
                })
            })
        }
    }
    async addItem(name, price) {
        const item= await new Item({name: name, price: price, menu_id: this.id})
        
        this.items.push(item)
    }


}
module.exports = { Menu }