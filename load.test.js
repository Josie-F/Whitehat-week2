const db = require('./db')
const { Restaurant } = require('./Restaurant')
const { Menu } = require('./Menu')
const { Item } = require('./Item')
const load = require('./index')


beforeAll(done => {
    db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT, image TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, menu_id INTEGER, price FLOAT);
    `, (null, done))
})
describe.skip('load', () => {
    test('restaurants are loaded into database', (done) => {
        load(() => {
            db.get('SELECT COUNT(id) AS total FROM restaurants', function (err, row) {
                expect(row.total).toBe(8)

                done()
            })

        })
    })
    test('menus are loaded into database', (done) => {
        load(() => {
            db.get('SELECT COUNT(id) as total FROM menus', function (err, row) {
                expect(row.total).toBe(18)

                done()
            })

        })
    })
    test('items are loaded into database', (done) => {
        load(() => {
            db.get('SELECT COUNT(id) as total FROM items', function (err, row) {
                expect(row.total).toBe(84)

                done()
            })

        })
    })
})

describe('Restaurants', () => {
    test('when restaurants are created they are added to the database', async () => {
        const restaurant = await new Restaurant({ name: "Dim T", image: "https://food-images.files.bbci.co.uk/food/recipes/vietnamese_beef_pho_22510_16x9.jpg" })
        expect(restaurant.id).toBe(1)
    })
    test('when you get a restaurant from the database it will return an instance of the Restaurant class', async () => {
        const restaurants = await Restaurant.findAll()
        expect(Array.isArray(restaurants)).toBeTruthy()
        expect(restaurants[0] instanceof Restaurant).toBeTruthy()
        expect(restaurants[0].name).toBe("Dim T")
    })
})
describe('Menus', () => {
    test('when menus are created they are added to the database', async () => {
        const menu = await new Menu({ title: "Dinner Menu", restaurant_id: 1 })
        expect(menu.id).toBe(1)
    })
    test('when you get a menu from the database it will return an instance of the Menu class', async () => {
        const menus = await Menu.findAll()
        expect(Array.isArray(menus)).toBeTruthy()
        expect(menus[0] instanceof Menu).toBeTruthy()
        expect(menus[0].title).toBe("Dinner Menu")
        expect(menus[0].restaurant_id).toBe(1)
    })
})


describe('Items', () => {
    test('when items are created they are added to the database', async () => {
        const item = await new Item({ name: "Beef Pho with Beansprouts and Spring onions", menu_id: 1, price: 10.00 })
        expect(item.id).toBe(1)
    })
    test('when you get an item from the database it will return an instance of the Item class', async () => {
        const items = await Item.findAll()
        expect(Array.isArray(items)).toBeTruthy()
        expect(items[0] instanceof Item).toBeTruthy()
        expect(items[0].name).toBe("Beef Pho with Beansprouts and Spring onions")
        expect(items[0].price).toBe(10.00)
        expect(items[0].menu_id).toBe(1)
    })
})
