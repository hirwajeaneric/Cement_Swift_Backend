const CartItemModel = require('../models/cart.model.js');
const OrderModel = require('../models/order.model.js');
const ReportModel = require('../models/report.model.js');
const { updateReport } = require('../utils/helperFunctions.js');

// Create order 
const createOrder = async (req, res, next) => {
    try {
        const createdOrder = await OrderModel.create(req.body);

        // Fetch report according to the year or create one if there isn't any.
        var reportOfThisYear = {};
        reportOfThisYear = await ReportModel.findOne({ year: new Date().getFullYear() });

        if (!reportOfThisYear) {
            reportOfThisYear = await ReportModel.create({ year: new Date().getFullYear() });
        };

        await CartItemModel.updateMany(
            {
                status: 'pending',
                customerId: createdOrder.customerId
            },
            {
                orderId: createdOrder._id,
                status: 'complete',
                completedOn: new Date().toISOString()
            }
        );

        const allUpdatedCartItems = await CartItemModel.find({ orderId: createdOrder._id });
        
        // Update report with the updated cart items.
        const updatedReport = updateReport(allUpdatedCartItems, reportOfThisYear);
        await updatedReport.save();

        res.status(200).json({ order: createdOrder });
    } catch (error) {
        next(error);
    }
};

// Update order
const updateOrder = async (req, res, next) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(req.query.id, { $set: req.body }, { new: true });
        res.status(200).json({ order: updatedOrder });
    } catch (error) {
        next(error);
    }
};

const listOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({});
        res.status(200).json({ orders: orders });
    } catch (error) {
        next(error);
    }
}

const clientOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({ customerId: req.query.customerId, status: req.query.status || 'paid' });
        if (orders.length === 0) {
            res.status(200).json({ orders: [] });
        }
        res.status(200).json({ orders: orders });
    } catch (error) {
        next(error);
    }
}

const clientPurchases = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({ customerId: req.query.customerId, status: req.query.status || 'shipped' });
        if (orders.length === 0) {
            res.status(200).json({ orders: [] });
        }
        res.status(200).json({ orders: orders });
    } catch (error) {
        next(error);
    }
}

const findById = async (req, res, next) => {
    try {
        const foundOrder = await OrderModel.findById(req.query.id);
        if (foundOrder) {
            res.status(200).json({ order: foundOrder });
        }
    } catch (error) {
        next(error);
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        await OrderModel.findByIdAndDelete(req.params.id);
        res.status(200).json('Order has been deleted');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    listOrders,
    clientOrders,
    clientPurchases,
    findById
}