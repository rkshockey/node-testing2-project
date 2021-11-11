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

describe('[GET] /api/users/:id', () => {
    let res
    beforeEach(async () => {
        res = await request(server).get('/api/users/1')
    })
    it('[3] returns the correct user', () => {
        const expected = { username: 'foo', id: 1 }
        expect(res.body).toMatchObject(expected)
    })
    it('[4] returns 200 okay', () => {
        expect(res.status).toBe(200)
    })
})


describe('[POST] /api/users', () => {
    const newUser = { username: 'fizz', password: 'buzz' }
    const badUser1 = { password: 'buzz' }
    const badUser2 = { username: 'fizz' }
    const badUser3 = { username: 'foo', password: 'bar' }
    const badUser4 = { username: '', password: 'bar' }
    it('[5] responds with a 201', async () => {
        const res = await request(server)
            .post('/api/users')
            .send(newUser)
        expect(res.status).toBe(201)
    })
    it('[6] returns the new user', async () => {
        const res = await request(server)
            .post('/api/users')
            .send(newUser)
        const expected = { username: 'fizz', id: 3 }
        expect(res.body).toMatchObject(expected)
    })
    it('[7] does not save the password as plain text', async () => {
        const res = await request(server)
            .post('/api/users')
            .send(newUser)
        expect(res.body.password).not.toBe(newUser.password)
    })
    it('[8] responds with 400 error code for bad requests', async () =>{
        let res = await request(server)
            .post('/api/users')
            .send(badUser1)
        expect(res.status).toBe(400)
        res = await request(server)
            .post('/api/users')
            .send(badUser2)
        expect(res.status).toBe(400)
        res = await request(server)
            .post('/api/users')
            .send(badUser3)
        expect(res.status).toBe(400)
        res = await request(server)
            .post('/api/users')
            .send(badUser4)
        expect(res.status).toBe(400)
    })
    it('[9] responds with proper message for missing properties', async () => {
        let res = await request(server)
            .post('/api/users')
            .send(badUser1)
        expect(res.body.message).toBe('Username and password are required')
        res = await request(server)
            .post('/api/users')
            .send(badUser2)
        expect(res.body.message).toBe('Username and password are required')
    })
    it('[10] responds with proper error message for taken username', async () =>{
        const res = await request(server)
            .post('/api/users')
            .send(badUser3)
        expect(res.body.message).toBe('That username is taken')
    })
    it('[11] responds with propper message for short username', async () => {
        const res = await request(server)
            .post('/api/users')
            .send(badUser3)
        expect(res.body.message).toBe('Username must be at least 3 characters')
    })
})

describe('[DELETE] /api/users/id', () => {
    it('returns 200 ok', async () => {
        const res = await request(server).delete('/api/users/1')
        expect(res.status).toBe(200)
    })
    it('deletes a record', async () => {
        await request(server).delete('/api/users/1')
        const actual = await db('users')
        expect(actual).toHaveLength(1)
    })
    it('deletes the correct object', async () => {
        await request(server).delete('/api/users/1')
        const actual = await db('users')
        const expected = [{ id: 2, username: 'bar' }]
        expect(actual).toMatchObject(expected)
    })
    it('returns the deleted object', async () => {
        const res = await request(server).delete('/api/users/1')
        const expected = { id: 1, username: 'foo' }
        expect(res.body).toMatchObject(expected)
    })
})