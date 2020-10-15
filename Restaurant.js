const db = require('./db')
const {Menu} = require('./Menu')

class Restaurant {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM restaurants;', async function (err, rows) {
                const restaurants = await Promise.all(rows.map(row => new Restaurant(row)))

                resolve(restaurants)
            })
        })



    }
    constructor(data) {
        const restaurant = this
        restaurant.name = data.name
        restaurant.image = data.image
        restaurant.id = data.id
        restaurant.menus = [];

        if (data.id) {  
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM menus WHERE restaurant_id=?;', [restaurant.id], async function (err, rows) {
                    restaurant.menus = await Promise.all(rows.map(row => new Menu(row)))
                    resolve(restaurant)
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO restaurants(name, image) VALUES(?,?);', [restaurant.name, restaurant.image], function (err) {
                    restaurant.id = this.lastID
                    resolve(restaurant)
                })
            })
        }
    
 }
async addMenu(title) {
        const menu = await new Menu({title: title, restaurant_id: this.id})
        this.menus.push(menu)
    }
}



module.exports = { Restaurant }