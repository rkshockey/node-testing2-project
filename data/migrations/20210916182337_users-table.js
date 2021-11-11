
exports.up = async function(knex) {
    return await knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('username').unique().notNullable();
        table.string('password').notNullable()
    });
};

exports.down = async function(knex) {
  return await knex.schema.dropTableIfExists('users');
};
