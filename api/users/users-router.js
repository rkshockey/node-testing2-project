const router = require('express').Router();
const Users = require('./users-model')
const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../../env_connect')

router.get('/', async (req, res, next) => {
    try {
        const users = await Users.getAll()
        res.status(200).json(users)
    }catch (err){
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const user = await Users.getById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
        const user = await Users.add({username, password: hash})
        res.status(201).json(user)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', (req, res, next) => {

})

router.delete('/:id', async (req, res, next) => {
    try {
        const user = await Users.remove(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
})

module.exports = router;
