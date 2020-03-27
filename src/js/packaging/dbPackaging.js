const { query } = require('../db');

async function selectPackagingByName(name) {
  const q = 'SELECT * FROM packaging WHERE name=$1';
  const result = await query(q, [name]);
  return result.rows;
}

async function selectPackaging() {
  const q = 'SELECT * FROM packaging';
  const result = await query(q);
  return result.rows;
}

module.exports = {
  selectPackagingByName,
  selectPackaging,
};
