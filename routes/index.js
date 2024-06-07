const express = require('express');
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');
const cartRouter = require('./cart.routes');
const orderRouter = require('./order.routes');
const checkoutRouter = require('./checkout.routes');

const allRoutes = express.Router();

allRoutes.use('/user', userRouter);
allRoutes.use('/auth', authRouter);
allRoutes.use('/cart', cartRouter);
allRoutes.use('/order', orderRouter);
allRoutes.use('/checkout', checkoutRouter)

module.exports = allRoutes;