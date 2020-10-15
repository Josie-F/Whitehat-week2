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
describe('load', () => {
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
        expect(restaurant.id).toBe(9)
    })
    test('when you get a restaurant from the database it will return an instance of the Restaurant class', async () => {
        const restaurants = await Restaurant.findAll()
        expect(Array.isArray(restaurants)).toBeTruthy()
        expect(restaurants[8] instanceof Restaurant).toBeTruthy()
        expect(restaurants[8].name).toBe("Dim T")
        
    })
})
describe('Menus', () => {
    test('when menus are created they are added to the database', async () => {
        const menu = await new Menu({ title: "Dinner Menu", restaurant_id: 9 })
        expect(menu.id).toBe(19)
    })
    test('when you get a menu from the database it will return an instance of the Menu class', async () => {
        const menus = await Menu.findAll()
        expect(Array.isArray(menus)).toBeTruthy()
        expect(menus[18] instanceof Menu).toBeTruthy()
        expect(menus[18].title).toBe("Dinner Menu")
        expect(menus[18].restaurant_id).toBe(9)
    })
})


describe('Items', () => {
    test('when items are created they are added to the database', async () => {
        const item = await new Item({ name: "Beef Pho with Beansprouts and Spring onions", menu_id: 19, price: 10.00 })
        expect(item.id).toBe(85)
    })
    test('when you get an item from the database it will return an instance of the Item class', async () => {
        const items = await Item.findAll()
        expect(Array.isArray(items)).toBeTruthy()
        expect(items[84] instanceof Item).toBeTruthy()
        expect(items[84].name).toBe("Beef Pho with Beansprouts and Spring onions")
        expect(items[84].price).toBe(10.00)
        expect(items[84].menu_id).toBe(19)
    })
})

describe('Relationships', () => {
    test('A menu belongs to a restaurant', async () => {
        const restaurants = await new Restaurant({ name: "TGIF", image: "https://food-images.files.bbci.co.uk/food/recipes/vietnamese_beef_pho_22510_16x9.jpg" })
        await restaurants.addMenu('Dinner Menu', 10)
        expect(restaurants.menus[0].title).toBe('Dinner Menu')
        expect(restaurants.name).toBe('TGIF')
    })
    test('items belong to a menu', async () => {
        const menus = await new Menu({title: 'Brunch Buffet', restaurant_id: 10})
        await menus.addItem('Scrambled Eggs', 4)
        expect(menus.items[0].name).toBe('Scrambled Eggs')
    })
    test('restaurant has menus with items', async() => {
        const rest = await new Restaurant({name: "Balthazaros", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/healthy_porridge_bowl-d434804.jpg?quality=90&resize=500%2C454"})
        await rest.addMenu('Breakfast Menu')
        await rest.addMenu('A La Carte Menu')
        await rest.menus[0].addItem('Poached Eggs',  5)
        await rest.menus[1].addItem('Beef fillet', 12)

        expect(rest.menus[0].items[0].name).toBe('Poached Eggs')
        expect(rest.menus[1].items[0].name).toBe('Beef fillet')
        expect(rest.menus[0].items[0].price).toBe(5)
    })
})

