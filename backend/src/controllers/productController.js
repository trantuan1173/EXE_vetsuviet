const productService = require('../services/productService');
const { sendResponse } = require('../utils/response');
const storage = require('../services/storageService');
const Product = require('../models/Product');

const PRESIGNED_TTL_SECONDS = parseInt(process.env.IMAGE_PLAYBACK_URL_TTL_SECONDS || '3600', 10);

const productController = {
  // GET /api/products
  getProducts: async (req, res, next) => {
    try {
      const { page, limit, category, search, dynasty, course } = req.query;
      const result = await productService.getProducts({ page, limit, category, search, dynasty, course });
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

  // GET /api/products/dynasties
  getDynasties: async (req, res, next) => {
    try {
      const dynasties = await productService.getDynasties();
      sendResponse(res, 200, true, 'Dynasties retrieved', dynasties);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/courses
  getCourses: async (req, res, next) => {
    try {
      const courses = await productService.getCourses();
      sendResponse(res, 200, true, 'Courses retrieved', courses);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/course/:courseId
  getProductsByCourse: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const products = await productService.getProductsByCourse(req.params.courseId, limit);
      sendResponse(res, 200, true, 'Products retrieved', { products });
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

  // ---- Product Image Upload (MinIO) ----
  initProductImageUpload: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return sendResponse(res, 404, false, 'Product not found');

      const { fileName, contentType } = req.body;
      const key = `products/${product._id}/${Date.now()}-${fileName}`;

      await storage.ensureBucket();
      const { UploadId } = await storage.createMultipartUpload({ key, contentType });
      
      // Return partSize for multipart uploads
      const partSize = 5 * 1024 * 1024; // 5MB parts
      sendResponse(res, 200, true, 'Upload initiated', { key, uploadId: UploadId, partSize });
    } catch (error) {
      next(error);
    }
  },

  signProductImagePart: async (req, res, next) => {
    try {
      const { key, uploadId, partNumber } = req.body;
      const signedUrl = await storage.getUploadPartSignedUrl({ key, uploadId, partNumber });
      sendResponse(res, 200, true, 'Part signed', { signedUrl });
    } catch (error) {
      next(error);
    }
  },

  completeProductImageUpload: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return sendResponse(res, 404, false, 'Product not found');

      const { key, uploadId, parts } = req.body;
      await storage.completeMultipartUpload({ key, uploadId, parts });

      // Generate signed URL before saving to satisfy schema validation
      const signedUrl = await storage.getSignedPlaybackUrl(key, PRESIGNED_TTL_SECONDS);
      product.images.push({ url: signedUrl, key });
      await product.save();

      const newImage = product.images[product.images.length - 1];
      const imageResponse = { ...newImage.toObject(), url: signedUrl };
      sendResponse(res, 200, true, 'Image uploaded', { image: imageResponse });
    } catch (error) {
      next(error);
    }
  },

  abortProductImageUpload: async (req, res, next) => {
    try {
      const { key, uploadId } = req.body;
      await storage.abortMultipartUpload({ key, uploadId });
      sendResponse(res, 200, true, 'Upload aborted');
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/products/:id/image - xoá 1 ảnh khỏi product
  deleteProductImage: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return sendResponse(res, 404, false, 'Product not found');

      const { imageKey } = req.body;
      if (!imageKey) return sendResponse(res, 400, false, 'imageKey is required');

      // Remove from MinIO
      try {
        await storage.deleteObject(imageKey);
      } catch (_) {
        // Ignore if already deleted in MinIO
      }

      // Remove from product.images array
      product.images = product.images.filter((img) => img.key !== imageKey);
      await product.save();

      sendResponse(res, 200, true, 'Image deleted', { images: product.images });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
