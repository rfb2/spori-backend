const { query } = require('../db');


async function selectProducts(params) {
  const keys = Object.keys(params);

  keys.map((key) => {
    if (key === 'name') {
      keys[key] = `%${keys[key].toLowerCase()}%`;
    }
    return null;
  });

  const paramValues = Object.values(params);

  let searchParams = '';
  keys.forEach((key, index) => {
    let searchParam;
    if (key === 'name') {
      searchParam = `lower(title) LIKE $${index + 1}`;
    } else if (key === 'code') {
      searchParam = `lower(author) LIKE $${index + 1}`;
    } else if (key === 'packaging') {
      searchParam = `price >= $${index + 1}`;
    } else if (key === 'origin') {
      searchParam = `price <= $${index + 1}`;
    } else if (key === 'grade') {
      searchParam = `price = $${index + 1} `;
    }

    if (index === keys.length - 1) {
      searchParams = searchParams.concat(searchParam);
    } else {
      searchParams = searchParams.concat(searchParam, ' AND ');
    }
  });

  let q;
  if (paramValues.length === 0) {
    q = 'SELECT * FROM books';
  } else {
    q = `SELECT * FROM books WHERE 
    ${searchParams}
    `;
  }

  const result = await query(q, [
    ...paramValues,
  ]);
  return result.rows;
}

module.exports = {
  selectProducts,
};
