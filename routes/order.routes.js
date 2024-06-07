const express = require('express');
const { updateOrder, deleteOrder, findById, listOrders, clientOrders } = require('../controllers/order.controllers.js');

const router = express.Router();

router.put('/update', updateOrder);
router.delete('/delete', deleteOrder);
router.get('/list', listOrders);
router.get('/getClientOrders', clientOrders);
router.get('/findById', findById);

module.exports = router;