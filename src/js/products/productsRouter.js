const express = require('express');

const { catchErrors, isNumber, calcGrade } = require('../utils');
const { selectProducts, selectByCodeProducts } = require('./dbProducts');

const router = express.Router();

async function productsCodeRoute(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return next();
  }

  if (!isNumber(id)) {
    return res.status(400).json({
      error: 'Leita verður af vöru eftir strikamerkisnúmeri',
    });
  }

  const product = await selectByCodeProducts(id);

  if (product) {
    const grade = calcGrade(product);

    product.grade = grade;
    return res.status(200).json(product);
  }
  return res.status(404);
}

async function productsRoute(req, res) {
  const {
    name,
    code,
    packaging,
    origin,
    score,
  } = req.query;

  const search = {};
  if (name) {
    search.name = name;
  }
  if (code) {
    search.code = code;
  }
  if (packaging) {
    search.packaging = packaging;
  }
  if (origin) {
    search.origin = origin;
  }
  if (score) {
    search.grade = score;
  }

  const products = await selectProducts(search);

  if (products && products.length !== 0) {
    const prodsWithGrade = products.map((prod) => {
      const grade = calcGrade(prod);
      return { ...prod, grade };
    });
    return res.status(200).json(prodsWithGrade);
  }
  return res.status(404).json({ error: 'No products found' });
}

router.get('/', catchErrors(productsRoute));
router.get('/:id', catchErrors(productsCodeRoute));

module.exports = router;
