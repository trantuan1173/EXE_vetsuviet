const Product = require('../models/Product');
const storageService = require('./storageService');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');

const PRESIGNED_TTL_SECONDS = parseInt(process.env.IMAGE_PLAYBACK_URL_TTL_SECONDS || '3600', 10);

const withSignedImageUrls = async (product) => {
  if (!product) return product;
  const plain = typeof product.toObject === 'function' ? product.toObject() : { ...product };
  if (!plain.images || plain.images.length === 0) return plain;

  plain.images = await Promise.all(
    plain.images.map(async (img) => {
      if (!img.key) return img;
      try {
        const signedUrl = await storageService.getSignedPlaybackUrl(img.key, PRESIGNED_TTL_SECONDS);
        return { ...img, url: signedUrl };
      } catch {
        return img;
      }
    })
  );
  return plain;
};

const withSignedImageUrlsAll = async (products) => Promise.all((products || []).map(withSignedImageUrls));

const productService = {
  // Get products with pagination and filters
  getProducts: async ({ page = 1, limit = DEFAULT_PAGE_SIZE, category, search, dynasty, course }) => {
    const query = { isPublished: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by course ID
    if (course) {
      query.courses = course;
    }

    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    let products, total;

    // If filtering by dynasty, we need to populate courses and filter
    if (dynasty) {
      const allProducts = await Product.find(query)
        .populate('courses', 'title dynasty')
        .sort({ createdAt: -1 });
      
      const filteredProducts = allProducts.filter(product => 
        product.courses && product.courses.some(course => course.dynasty === dynasty)
      );

      total = filteredProducts.length;
      products = filteredProducts.slice(skip, skip + safeLimit);
    } else {
      [products, total] = await Promise.all([
        Product.find(query).populate('courses', 'title dynasty').sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
        Product.countDocuments(query),
      ]);
    }

    const normalizedProducts = await withSignedImageUrlsAll(products);
    return {
      products: normalizedProducts,
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
    const product = await Product.findById(productId).populate('courses', 'title');
    if (!product) throw new Error('Product not found');
    return withSignedImageUrls(product);
  },

  // Get all categories
  getCategories: async () => {
    const categories = await Product.distinct('category');
    return categories;
  },

  // Get all dynasties from courses that are linked to products
  getDynasties: async () => {
    const Course = require('../models/Course');
    const products = await Product.find({ isPublished: true, courses: { $exists: true, $ne: [] } })
      .populate('courses', 'dynasty')
      .lean();
    
    const dynastiesSet = new Set();
    products.forEach(product => {
      if (product.courses && product.courses.length > 0) {
        product.courses.forEach(course => {
          if (course.dynasty) {
            dynastiesSet.add(course.dynasty);
          }
        });
      }
    });
    
    return Array.from(dynastiesSet).sort();
  },

  // Get all courses that are linked to products
  getCourses: async () => {
    const Course = require('../models/Course');
    const products = await Product.find({ isPublished: true, courses: { $exists: true, $ne: [] } })
      .populate('courses', 'title _id')
      .lean();
    
    const coursesMap = new Map();
    products.forEach(product => {
      if (product.courses && product.courses.length > 0) {
        product.courses.forEach(course => {
          if (course._id && course.title) {
            coursesMap.set(course._id.toString(), {
              _id: course._id,
              title: course.title
            });
          }
        });
      }
    });
    
    return Array.from(coursesMap.values());
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
      Product.find().populate('courses', 'title').sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Product.countDocuments(),
    ]);

    const normalizedProducts = await withSignedImageUrlsAll(products);
    return {
      products: normalizedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
      },
    };
  },

  // Get products by course ID
  getProductsByCourse: async (courseId, limit = 3) => {
    const products = await Product.find({
      courses: courseId,
      isPublished: true,
      stock: { $gt: 0 },
    })
      .limit(limit)
      .sort({ createdAt: -1 });

    return withSignedImageUrlsAll(products);
  },
};

module.exports = productService;
