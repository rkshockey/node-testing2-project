const knex = require('knex');
const config = require('../knexfile');
const { NODE_ENV } = require('../env_connect')

module.exports = knex(config[NODE_ENV])
