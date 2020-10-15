const db = require('./db')

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

        if (data.id) {
            return Promise.resolve(restaurant)
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO restaurants(name, image) VALUES(?,?);', [this.name, this.image], function (err) {
                    restaurant.id = this.lastID
                    resolve(restaurant)
                })
            })
        }
    }


}



module.exports = { Restaurant }