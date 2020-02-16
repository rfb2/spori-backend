const express = require('express');

const { catchErrors, isNumber } = require('../utils');
const { selectProducts, selectByIdProducts } = require('./dbProducts');

const router = express.Router();

async function productsIDRoute(req, res, next) {
  const { id } = req.params;

  // TODO: bæta við fleiri search valmöguleikum

  if (!id) {
    return next();
  }

  if (!isNumber(id)) {
    return res.status(400).json({
      error: 'Leita verður af vöru eftir ID-númeri',
    });
  }

  const product = await selectByIdProducts(id);

  if (product) {
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
    grade,
  } = req.query;

  // TODO: bæta við fleiri search valmöguleikum
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
  if (grade) {
    search.grade = grade;
  }

  const product = await selectProducts(search);

  if (product) {
    return res.status(200).json(product);
  }
  return res.status(404);
}

router.get('/', catchErrors(productsRoute));
router.get('/:id', catchErrors(productsIDRoute));

module.exports = router;
