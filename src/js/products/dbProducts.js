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
      searchParam = `lower(products.name) LIKE $${index + 1}`;
    } else if (key === 'code') {
      searchParam = `lower(code) LIKE $${index + 1}`;
    } else if (key === 'packaging') {
      searchParam = `lower(packaging) LIKE $${index + 1}`;
    } else if (key === 'origin') {
      searchParam = `lower(origin) LIKE $${index + 1}`;
    } else if (key === 'score') {
      searchParam = `score = $${index + 1} `;
    }

    if (index === keys.length - 1) {
      searchParams = searchParams.concat(searchParam);
    } else {
      searchParams = searchParams.concat(searchParam, ' AND ');
    }
  });

  let q;
  if (paramValues.length === 0) {
    q = 'SELECT products.name AS name, code, packaging.name AS packaging, origin, score, packaging.footprint AS packaging_footprint, packaging.breakdown_time AS packaging_breakdown_time, packaging.reusability AS packaging_reusability FROM products JOIN packaging ON products.packaging=packaging.name';
  } else {
    q = `SELECT products.name AS name, code, packaging.name AS packaging, origin, score, packaging.footprint AS packaging_footprint, packaging.breakdown_time AS packaging_breakdown_time, packaging.reusability AS packaging_reusability FROM products JOIN packaging ON products.packaging=packaging.name WHERE
    ${searchParams}
    `;
  }

  const result = await query(q, [
    ...paramValues,
  ]);
  return result.rows;
}

async function selectByIdProducts(id) {
  const q = 'SELECT products.name AS name, code, packaging.name AS packaging, origin, score, packaging.footprint AS packaging_footprint, packaging.breakdown_time AS packaging_breakdown_time, packaging.reusability AS packaging_reusability FROM products JOIN packaging ON products.packaging=packaging.name WHERE products.id=$1';
  const result = await query(q, [id]);
  return result.rows;
}

module.exports = {
  selectProducts,
  selectByIdProducts,
};
