const Product = require('../models/Product');
const Order = require('../models/Order');
const RewardTransaction = require('../models/RewardTransaction');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');

const orderService = {
  // Create new order
  createOrder: async (userId, { items, paymentMethod, shippingAddress, shippingPhone }) => {
    let totalAmount = 0;

    // Validate products & calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (!product.isPublished) throw new Error(`Product is not available: ${product.name}`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for: ${product.name}`);
      }
      item.price = product.price;
      totalAmount += product.price * item.quantity;
    }

    // Generate order number
    const orderNumber = `VSV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      userId,
      orderNumber,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      shippingPhone,
      status: 'pending',
    });
    await order.save();

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return order;
  },

  // Get user orders
  getUserOrders: async (userId) => {
    return await Order.find({ userId })
      .populate('items.productId', 'name image price')
      .sort({ createdAt: -1 });
  },

  // Get single order detail
  getOrderDetail: async (orderId, userId) => {
    const query = userId ? { _id: orderId, userId } : { _id: orderId };
    const order = await Order.findOne(query).populate('items.productId', 'name image price');
    if (!order) throw new Error('Order not found');
    return order;
  },

  // Cancel order
  cancelOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw new Error('Order not found');
    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    return order;
  },

  // Admin: Get all orders
  getAllOrders: async ({ page = 1, limit = DEFAULT_PAGE_SIZE, status }) => {
    const query = status ? { status } : {};
    const safeLimit = Math.min(parseInt(limit), MAX_PAGE_SIZE);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'fullName email')
        .populate('items.productId', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
      },
    };
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) throw new Error('Order not found');
    return order;
  },

  // Admin: Get revenue stats
  getRevenueStats: async () => {
    const result = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    return result[0]?.totalRevenue || 0;
  },
};

module.exports = orderService;
