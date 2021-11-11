const db = require('../../data/db-config')

function getAll () {
    return db('users')
}

function getById (id) {
    return db('users')
        .where('id', id)
        .first()
}

function getBy (filter) {
    return db('users')
        .where(filter)
}

async function add (user) {
    const [id] = await db('users').insert(user)
    return getById(id)
}

async function update (id, user) {
    await db('users')
        .where('id', id)
        .update(user)
    return getById(id)
}

async function remove (id) {
    const user = await getById(id)
    await db('users')
        .where('id', id)
        .del()
    return user
}

module.exports = { 
    getAll,
    getById,
    getBy,
    add,
    update,
    remove
}
