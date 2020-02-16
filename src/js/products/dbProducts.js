const { query } = require('../db');


async function selectProducts(search) {
  const keys = Object.keys(search);
  const params = search;

  keys.map((key) => {
    if (key === 'name') {
      params[key] = `%${params[key].toLowerCase()}%`;
    }
    return null;
  });

  const paramValues = Object.values(params);

  let searchParams = '';
  keys.forEach((key, index) => {
    let searchParam;
    if (key === 'name') {
      searchParam = `lower(name) LIKE $${index + 1}`;
    } else if (key === 'code') {
      searchParam = `lower(code) LIKE $${index + 1}`;
    } else if (key === 'packaging') {
      searchParam = `lower(packaging) LIKE $${index + 1}`;
    } else if (key === 'origin') {
      searchParam = `lower(origin) LIKE $${index + 1}`;
    } else if (key === 'grade') {
      searchParam = `grade = $${index + 1} `;
    }

    if (index === keys.length - 1) {
      searchParams = searchParams.concat(searchParam);
    } else {
      searchParams = searchParams.concat(searchParam, ' AND ');
    }
  });

  let q;
  if (paramValues.length === 0) {
    q = 'SELECT * FROM products';
  } else {
    q = `SELECT * FROM products WHERE 
    ${searchParams}
    `;
  }

  const result = await query(q, [
    ...paramValues,
  ]);
  return result.rows;
}

async function selectByIdProducts(id) {
  const q = 'SELECT * FROM products WHERE id=$1';
  const result = await query(q, [id]);
  return result.rows;
}

module.exports = {
  selectProducts,
  selectByIdProducts,
};
