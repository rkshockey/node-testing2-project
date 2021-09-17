const router = require('express').Router();
const Users = require('./users-model')

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

router.post('/', (req, res, next) => {

})

router.put('/:id', (req, res, next) => {

})

router.delete('/:id', (req, res, next) => {

})

module.exports = router;
