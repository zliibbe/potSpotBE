/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('potholes', function (table) {
      table.increments('id').primary();
      table.string('latitude');
      table.string('longitude');
      table.string('description');

      table.timestamps(true, true);
    })
    .createTable('pictures', function (table) {
      table.increments('id').primary();
      table.string('url')
      table.integer('pothole_id').unsigned()
      table.foreign('pothole_id')
        .references('potholes.id');

      table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('pictures')
    .dropTable('potholes')
};
