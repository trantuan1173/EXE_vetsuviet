const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 6000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vết Sử Việt API',
      version: '1.0.0',
      description: 'API documentation for Vết Sử Việt MVP (Learning + Quiz + Shop).',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Auth', description: 'Authentication APIs' },
      { name: 'Courses', description: 'Course browsing and enrollment' },
      { name: 'Lessons', description: 'Lesson content APIs' },
      { name: 'Quiz', description: 'Quiz APIs' },
      { name: 'Products', description: 'Product APIs' },
      { name: 'Orders', description: 'Order APIs' },
      { name: 'Users', description: 'User profile APIs' },
      { name: 'Search', description: 'Global search APIs' },
      { name: 'Admin', description: 'Admin management APIs' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            data: { type: 'object', nullable: true },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'fullName'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
            fullName: { type: 'string', example: 'Nguyễn Văn A' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        CourseCreateRequest: {
          type: 'object',
          required: ['title', 'dynasty'],
          properties: {
            title: { type: 'string', example: 'Lịch sử Nhà Trần' },
            description: { type: 'string', example: 'Khóa học về triều đại nhà Trần' },
            dynasty: { type: 'string', example: 'Trần' },
            difficulty: { type: 'string', enum: ['basic', 'intermediate', 'advanced'], example: 'basic' },
            thumbnail: { type: 'string', example: 'https://example.com/course.jpg' },
            isPublished: { type: 'boolean', example: true },
          },
        },
        ProductCreateRequest: {
          type: 'object',
          required: ['name', 'category', 'price'],
          properties: {
            name: { type: 'string', example: 'Mô hình Tháp Rùa' },
            description: { type: 'string', example: 'Mô hình thu nhỏ Tháp Rùa' },
            category: { type: 'string', example: 'Mô hình' },
            price: { type: 'number', example: 150000 },
            image: { type: 'string', example: 'https://example.com/item.jpg' },
            stock: { type: 'number', example: 20 },
            isPublished: { type: 'boolean', example: true },
          },
        },
        SubmitQuizRequest: {
          type: 'object',
          required: ['quizId', 'userAnswers'],
          properties: {
            quizId: { type: 'string', example: '66518d73a67f7de8ed7d45c1' },
            userAnswers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionId: { type: 'string', example: '66518d73a67f7de8ed7d55a1' },
                  selectedAnswerIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['66518d73a67f7de8ed7d66a1'],
                  },
                },
              },
            },
          },
        },
        CreateOrderRequest: {
          type: 'object',
          required: ['items', 'paymentMethod', 'shippingAddress', 'shippingPhone'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string', example: '66518d73a67f7de8ed7d88a1' },
                  quantity: { type: 'integer', example: 2 },
                },
              },
            },
            paymentMethod: { type: 'string', enum: ['cash', 'card', 'bank'], example: 'cash' },
            shippingAddress: { type: 'string', example: '123 Lê Lợi, Q1, TP.HCM' },
            shippingPhone: { type: 'string', example: '0912345678' },
          },
        },
      },
    },
  },
  apis: ['./src/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
