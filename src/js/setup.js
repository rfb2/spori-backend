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
  await query('DROP TABLE IF EXISTS likedbooks');
  await query('DROP TABLE IF EXISTS tagsInBooks');
  await query('DROP TABLE IF EXISTS tags');
  await query('DROP TABLE IF EXISTS books');
  await query('DROP TABLE IF EXISTS users');

  console.info('Tables deleted');

  // create tables from schemas
  try {
    const tableUser = await readFileAsync('./src/sql/user/schemaUser.sql');
    const tableBook = await readFileAsync('./src/sql/book/schemaBook.sql');
    const tableTag = await readFileAsync('./src/sql/tag/schemaTag.sql');
    const tableTagsInBooks = await readFileAsync('./src/sql/tagsInBooks/schemaTagsInBooks.sql');
    const tableLikedBooks = await readFileAsync('./src/sql/likedBooks/schemaLikedBooks.sql');

    await query(tableUser.toString('utf8'));
    await query(tableBook.toString('utf8'));
    await query(tableTag.toString('utf8'));
    await query(tableTagsInBooks.toString('utf8'));
    await query(tableLikedBooks.toString('utf8'));

    console.info('Tables created');
  } catch (e) {
    console.error('Error creating tables:', e.message);
    return;
  }

  // insert data into tables
  try {
    const insertUser = await readFileAsync('./src/sql/user/insertUser.sql');
    const insertBook = await readFileAsync('./src/sql/book/insertBook.sql');
    const insertTag = await readFileAsync('./src/sql/tag/insertTag.sql');
    const insertTagsInBooks = await readFileAsync('./src/sql/tagsInBooks/insertTagsInBooks.sql');
    const insertLikedBooks = await readFileAsync('./src/sql/likedBooks/insertLikedBooks.sql');

    await query(insertUser.toString('utf8'));
    await query(insertBook.toString('utf8'));
    await query(insertTag.toString('utf8'));
    await query(insertTagsInBooks.toString('utf8'));
    await query(insertLikedBooks.toString('utf8'));

    console.info('Data inserted');
  } catch (e) {
    console.error('Error inserting data:', e.message);
  }
}


main().catch((err) => {
  console.error(err);
});
