const express = require('express');

const { catchErrors, isNumber } = require('../utils');
const selectProducts = require('./dbProducts');

const router = express.Router();

async function productsRoute(req, res, next) {
  const { id } = req.params;

  // TODO: bæta við fleiri search valmöguleikum

  if (!isNumber(id)) {
    return res.status(400).json({
      error: 'Leita verður af vöru eftir ID-númeri',
    });
  }

  if (id === undefined) {
    return next();
  }

  const product = await selectProducts({ id });

  if (product) {
    return res.status(200).json(product);
  }
  return res.status(404);
}

router.get('/', catchErrors(productsRoute));

module.exports = router;
