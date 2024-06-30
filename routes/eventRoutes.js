const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticateToken = require('../middlewares/authentication');

router.get('/', authenticateToken, eventController.getAllEvents);

module.exports = router;
