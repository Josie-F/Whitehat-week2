const db = require('./db')
const restaurants = require('./restaurants.json')





function insertRestaurants(restaurants, cb) {

    if(!restaurants.length) return cb()
    const restaurant = restaurants.pop()
    const name = restaurant.name
    const menus = restaurant.menus
    db.run(`INSERT INTO restaurants(name) VALUES('${name}')`, function (err) {
    const restaurant_id=this.lastID

       insertMenus(restaurant_id,menus,restaurants, cb) 
       
    }) 
}

function insertMenus(restaurant_id, menus, restaurants, cb) {
    if(!menus.length) return insertRestaurants(restaurants, cb)
    const menu = menus.pop()
    const title = menu.title
    const items = menu.items
    db.run(`INSERT INTO menus(title, restaurant_id) VALUES('${title}', '${restaurant_id}')`, function (err) {
        const menu_id=this.lastID
        insertItems(menu_id, items, menus, restaurants, restaurant_id, cb)
          
})
}

function insertItems(menu_id, items, menus, restaurants, restaurant_id, cb) {
    if(!items.length) return insertMenus(restaurant_id, menus, restaurants, cb)
    const item = items.pop()
    const price = item.price
    const name = item.name
    db.run(`INSERT INTO items(name, price, menu_id) VALUES('${name}', '${price}', '${menu_id}')`, function (err) {
        insertItems(menu_id, items, menus, restaurants, restaurant_id, cb)
    })
}


function load(cb) {
    db.run('CREATE TABLE IF NOT EXISTS restaurants(id INTEGER PRIMARY KEY, name TEXT);')
    db.run('CREATE TABLE IF NOT EXISTS menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);')
    db.run('CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT);')
    insertRestaurants(restaurants, cb)
    
}


module.exports = load