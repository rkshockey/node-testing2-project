
exports.up = function(knex) {
    knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('username').unique().notNullable();
        table.string('password').notNullable()
    });
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('users');
};
