const request = require('supertest')
const server = require('./server')
const db = require('../data/db-config')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db.seed.run()
})

test('[0] sanity', () => {
    expect(true).not.toBe(false)
})

describe('[GET] /api/users', () => {
    it('[1] returns 200 ok', async () => {
        const res = await request(server).get('/api/users')
        expect(res.status).toBe(200)
    })
    it('[2] returns the array of users', async () => {
        const res = await request(server).get('/api/users')
        const expected = [
            { username: 'foo', id: 1 },
            { username: 'bar', id: 2 }
        ]
        expect(res.body).toMatchObject(expected)
    })
})
