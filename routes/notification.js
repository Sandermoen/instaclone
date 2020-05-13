const express = require('express');
const notificationRouter = express.Router();

const {
  retrieveNotifications,
  readNotifications,
} = require('../controllers/notificationController');
const { requireAuth } = require('../controllers/authController');

notificationRouter.get('/', requireAuth, retrieveNotifications);

notificationRouter.put('/', requireAuth, readNotifications);

module.exports = notificationRouter;
