const db = require('./db')
const load = require('./index')


beforeAll(done => {
    db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, menu_id INTEGER, price FLOAT);
    `, load.bind(null, done))
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