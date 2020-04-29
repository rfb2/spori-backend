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
  await query('DROP TABLE IF EXISTS products');
  await query('DROP TABLE IF EXISTS packaging');
  await query('DROP TABLE IF EXISTS origin');

  console.info('Tables deleted');

  // create tables from schemas
  try {
    const tablePackaging = await readFileAsync('./src/sql/packaging/schemaPackaging.sql');
    const tableOrigin = await readFileAsync('./src/sql/origin/schemaOrigin.sql');
    const tableProducts = await readFileAsync('./src/sql/products/schemaProducts.sql');

    await query(tablePackaging.toString('utf8'));
    await query(tableOrigin.toString('utf8'));
    await query(tableProducts.toString('utf8'));

    console.info('Tables created');
  } catch (e) {
    console.error('Error creating tables:', e.message);
    return;
  }

  // insert data into tables
  try {
    const insertPackaging = await readFileAsync('./src/sql/packaging/insertPackaging.sql');
    const insertOrigin = await readFileAsync('./src/sql/origin/insertOrigin.sql');
    const insertProducts = await readFileAsync('./src/sql/products/insertProducts.sql');

    await query(insertPackaging.toString('utf8'));
    await query(insertOrigin.toString('utf8'));
    await query(insertProducts.toString('utf8'));

    console.info('Data inserted');
  } catch (e) {
    console.error('Error inserting data:', e.message);
  }
}


main().catch((err) => {
  console.error(err);
});
