const express = require('express');
const { getClientSecret } = require('../controllers/checkout.controllers');
const checkoutRouter = express.Router();

checkoutRouter.post('/secret', getClientSecret);

module.exports = checkoutRouter;