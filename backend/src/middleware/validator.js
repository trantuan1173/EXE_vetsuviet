const { body, param, query, validationResult } = require('express-validator');
const { sendResponse } = require('../utils/response');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return sendResponse(res, 400, false, errorMessages.join(', '));
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Course validation rules
const createCourseValidation = [
  body('title').notEmpty().withMessage('Course title is required'),
  body('dynasty').notEmpty().withMessage('Dynasty is required'),
  body('difficulty')
    .optional()
    .isIn(['basic', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
];

// Quiz submission validation
const submitQuizValidation = [
  body('quizId').isMongoId().withMessage('Valid quiz ID is required'),
  body('userAnswers').isArray().withMessage('User answers must be an array'),
];

// Order validation
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod')
    .isIn(['cash', 'card', 'bank'])
    .withMessage('Invalid payment method'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingPhone').notEmpty().withMessage('Shipping phone is required'),
];

// MongoDB ObjectId validation
const mongoIdValidation = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('Invalid ID format'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createCourseValidation,
  submitQuizValidation,
  createOrderValidation,
  mongoIdValidation,
};
