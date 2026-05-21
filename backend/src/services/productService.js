const Product = require('../models/Product');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');

const productService = {
  // Get products with pagination and filters
  getProducts: async ({ page = 1, limit = DEFAULT_PAGE_SIZE, category, search }) => {
    const query = { isPublished: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Product.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
        itemsPerPage: safeLimit,
      },
    };
  },

  // Get product detail
  getProductDetail: async (productId) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    return product;
  },

  // Get all categories
  getCategories: async () => {
    const categories = await Product.distinct('category');
    return categories;
  },

  // Admin: CRUD Product
  createProduct: async (data) => {
    const product = new Product(data);
    return await product.save();
  },

  updateProduct: async (productId, data) => {
    const product = await Product.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new Error('Product not found');
    return product;
  },

  deleteProduct: async (productId) => {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) throw new Error('Product not found');
    return product;
  },

  // Admin: Get all products (including unpublished)
  getAllProductsAdmin: async ({ page = 1, limit = DEFAULT_PAGE_SIZE }) => {
    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Product.countDocuments(),
    ]);

    return {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
      },
    };
  },
};

module.exports = productService;
