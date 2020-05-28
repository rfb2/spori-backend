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
    q = 'SELECT products.name AS name, code, origin.name AS origin, origin.distance AS origin_distance, score, packaging.name AS packaging, packaging.footprint AS packaging_footprint, packaging.breakdown_time AS packaging_breakdown_time, packaging.reusability AS packaging_reusability, packaging_weight FROM products JOIN packaging ON products.packaging=packaging.name JOIN origin on products.origin=origin.name ORDER BY products.name';
  } else {
    q = `SELECT products.name AS name, code, origin.name AS origin, origin.distance AS origin_distance, score, packaging.name AS packaging, packaging.footprint AS packaging_footprint, packaging.breakdown_time AS packaging_breakdown_time, packaging.reusability AS packaging_reusability, packaging_weight FROM products JOIN packaging ON products.packaging=packaging.name JOIN origin on products.origin=origin.name ORDER BY products.name WHERE
    ${searchParams}
    `;
  }

  const result = await query(q, [
    ...paramValues,
  ]);
  return result.rows;
}

async function selectByCodeProducts(id) {
  const q = 'SELECT products.name AS name, code, origin.name AS origin, origin.distance AS origin_distance, score, packaging.name AS packaging, packaging.footprint AS packaging_footprint, packaging.breakdown_time AS packaging_breakdown_time, packaging.reusability AS packaging_reusability, packaging_weight FROM products JOIN packaging ON products.packaging=packaging.name JOIN origin on products.origin=origin.name WHERE products.code=$1 ORDER BY products.name';
  const result = await query(q, [id]);
  return result.rows[0];
}

module.exports = {
  selectProducts,
  selectByCodeProducts,
};
