const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// GET /api/search?q=...&type=course|product
router.get('/', searchController.globalSearch);

module.exports = router;
