/**
 * This module combines all the different routes and creates the server API.
 */


const express = require('express');

const productsRouter = require('./products/productsRouter');


/**
 * Route to show all the available API endpoints.
 */
function titlePage(req, res) {
  return res.json({
    products: {
      products: '/products/',
      product: '/products/{id}',
    },
  });
}


const router = express.Router();
router.get('/', titlePage);
router.use('/products', productsRouter);

module.exports = router;
