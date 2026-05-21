const productService = require('../services/productService');
const { sendResponse } = require('../utils/response');

const productController = {
  // GET /api/products
  getProducts: async (req, res, next) => {
    try {
      const { page, limit, category, search } = req.query;
      const result = await productService.getProducts({ page, limit, category, search });
      sendResponse(res, 200, true, 'Products retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/:id
  getProductDetail: async (req, res, next) => {
    try {
      const product = await productService.getProductDetail(req.params.id);
      sendResponse(res, 200, true, 'Product detail retrieved', product);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/categories
  getCategories: async (req, res, next) => {
    try {
      const categories = await productService.getCategories();
      sendResponse(res, 200, true, 'Categories retrieved', categories);
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN ----
  // GET /api/admin/products
  getAllProductsAdmin: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await productService.getAllProductsAdmin({ page, limit });
      sendResponse(res, 200, true, 'All products retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/products
  createProduct: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);
      sendResponse(res, 201, true, 'Product created', product);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/products/:id
  updateProduct: async (req, res, next) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      sendResponse(res, 200, true, 'Product updated', product);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/products/:id
  deleteProduct: async (req, res, next) => {
    try {
      await productService.deleteProduct(req.params.id);
      sendResponse(res, 200, true, 'Product deleted');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
