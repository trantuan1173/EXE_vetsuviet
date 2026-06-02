const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/categories
router.get('/categories', productController.getCategories);

// GET /api/products/course/:courseId
router.get('/course/:courseId', productController.getProductsByCourse);

// GET /api/products/:id
router.get('/:id', productController.getProductDetail);

module.exports = router;
