/**
 * This module is responsible for setting up the database by
 * running all the sql scripts.
 */


require('dotenv').config();

const fs = require('fs');
const util = require('util');

const { query } = require('./db');

const connectionString = process.env.DATABASE_URL;
const readFileAsync = util.promisify(fs.readFile);


/**
 * Run all the sql scripts.
 */
async function main() {
  console.info(`Initializing database on ${connectionString}`);

  // drop tables if exists
  await query('DROP TABLE IF EXISTS ingredients');
  await query('DROP TABLE IF EXISTS ingredientsInProducts');
  await query('DROP TABLE IF EXISTS packaging');
  await query('DROP TABLE IF EXISTS products');
  // await query('DROP TABLE IF EXISTS users');

  console.info('Tables deleted');

  // create tables from schemas
  try {
    const tableIngredients = await readFileAsync('./src/sql/ingredients/schemaIngredients.sql');
    const tableIngrInProducts = await readFileAsync('./src/sql/ingredientsInProducts/schemaIngredientsInProducts.sql');
    const tablePackaging = await readFileAsync('./src/sql/packaging/schemaPackaging.sql');
    const tableProducts = await readFileAsync('./src/sql/products/schemaProducts.sql');

    await query(tableIngredients.toString('utf8'));
    await query(tableIngrInProducts.toString('utf8'));
    await query(tablePackaging.toString('utf8'));
    await query(tableProducts.toString('utf8'));

    console.info('Tables created');
  } catch (e) {
    console.error('Error creating tables:', e.message);
    return;
  }

  // insert data into tables
  try {
    const insertIngredients = await readFileAsync('./src/sql/ingredients/insertIngredients.sql');
    const insertIngrInProducts = await readFileAsync('./src/sql/ingredientsInProducts/insertIngredientsInProducts.sql');
    const insertPackaging = await readFileAsync('./src/sql/packaging/insertPackaging.sql');
    const insertProducts = await readFileAsync('./src/sql/products/insertProducts.sql');

    await query(insertIngredients.toString('utf8'));
    await query(insertIngrInProducts.toString('utf8'));
    await query(insertPackaging.toString('utf8'));
    await query(insertProducts.toString('utf8'));

    console.info('Data inserted');
  } catch (e) {
    console.error('Error inserting data:', e.message);
  }
}


main().catch((err) => {
  console.error(err);
});
