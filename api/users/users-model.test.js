const Users = require('./users-model')
const db = require('../../data/db-config')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db.seed.run()
})

describe('getAll', () => {
    it('returns the correct number of users', async () => {
        const actual = await Users.getAll();
        expect(actual).toHaveLength(2)
    })
    it('returns the correct users', async () => {
        const actual = await Users.getAll();
        const expected = [
            { id: 1, username: 'foo' },
            { id: 2, username: 'bar' }
        ]
        expect(actual).toMatchObject(expected)
    })
})

describe('getById', () => {
    let actual
    beforeEach(async () => {
        actual = await Users.getById(1)
    })
    it('returns an object', () => {
        expect(actual).toMatchObject({})
    })
    it('returns the correct user', () => {
        const expected = { id: 1, username: 'foo' }
        expect(actual).toMatchObject(expected)
    })
})

describe('getBy', () => {
    it('returns the correct username', async () => {
        const actual = await Users.getBy({ username: 'foo' })
        expect(actual[0]).toMatchObject({ username: 'foo' })
    })
    it('returns the expected id', async () => {
        const actual = await Users.getBy({ id: 1 })
        expect(actual[0]).toMatchObject({ id: 1 })
    })
})

describe('add', () => {
    const user = { username: 'fizz', password: 'buzz' }
    it('adds a new user', async () => {
        await Users.add(user)
        const actual = await db('users')
        expect(actual).toHaveLength(3)
    })
    it('returns the new user', async () => {
        const actual = await Users.add(user)
        expect(actual).toMatchObject({...user, id: 3})
    })
})

describe('update', () => {
    const userIn = { username: 'fizz', password: 'buzz' }
    const userOut = { ...userIn, id: 1 }
    it('does not change the length of the array', async () => {
        await Users.update(1, userIn)
        const actual = await db('users')
        expect(actual).toHaveLength(2);
    })
    it('updates the record', async () => {
        await Users.update(1, userIn)
        const actual = await db('users').where('id', 1).first()
        expect(actual).toMatchObject(userOut)
    })
    it('resolves to the updated record', async () => {
        const actual = await Users.update(1, userIn)
        expect(actual).toMatchObject(userOut)
    })
})

describe('remove', () => {
    it('removes one user', async () => {
        await Users.remove(1)
        const actual = await db('users')
        expect(actual).toHaveLength(1)
    })
    it('removes the correct user', async () => {
        await Users.remove(1)
        const users = await db('users')
        const actual = users.find(user => user.id === 1)
        expect(actual).not.toBeDefined()
    })
    it('resolves to the removed user', async () => {
        const actual = await Users.remove(1)
        const expected = { username: 'foo', id: 1 }
        expect(actual).toMatchObject(expected)
    })
})
