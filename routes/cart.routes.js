const express = require('express');
const { addCartItem, deleteCart, listItems, listAllItems, updateCartItem, completePayment, findByOrderId } = require('../controllers/cart.controllers.js');
const router = express.Router();

router.post('/add', addCartItem);
router.get('/list', listItems);
router.get('/getCartItems', listAllItems);
router.get('/listAll', listAllItems);
router.get('/findByOrderId', findByOrderId);
router.put('/update', updateCartItem);
router.put('/confirm', completePayment);
router.delete('/delete', deleteCart);

module.exports = router;