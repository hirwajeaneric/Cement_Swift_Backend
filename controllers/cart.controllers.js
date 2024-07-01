const CartItemModel = require('../models/cart.model');
const OrderModel = require('../models/order.model');

const addCartItem = async (req, res, next) => {
    try {
        const itemExists = await CartItemModel.findOne({
            productName: req.body.productName,
            customerId: req.body.customerId,
            status: 'pending'
        });

        if (itemExists) {
            var newQuantity = itemExists.quantity + 1;
            var newTotal = itemExists.total + req.body.price;

            const updatedCartItem = await CartItemModel.findByIdAndUpdate(
                itemExists._id,
                {
                    $set: {
                        quantity: newQuantity,
                        total: newTotal
                    }
                },
                {
                    new: true
                }
            );

            if (updatedCartItem) {
                const allItems = await CartItemModel.find({ customerId: updatedCartItem.customerId });
                res.status(200).json({ items: allItems });
            }

        } else {
            const newItem = await CartItemModel.create(req.body);
            if (newItem) {
                const allItems = await CartItemModel.find({ customerId: newItem.customerId, status: 'pending' });
                res.status(200).json({ items: allItems });
            }
        }
    } catch (error) {
        next(error);
    }
};

const listItems = async (req, res, next) => {
    try {
        const items = await CartItemModel.find({ customerId: req.query.customerId });
        res.status(200).json({ items });
    } catch (error) {
        next(error);
    }
};

const listAllItems = async (req, res, next) => {
    try {
        const items = await CartItemModel.find({});
        res.status(200).json({ items });
    } catch (error) {
        next(error);
    }
}

const findByOrderId = async (req, res, next) => {
    try {
        const items = await CartItemModel.find({ customerId: req.query.customerId, orderId: req.query.orderId });
        res.status(200).json({ items });
    } catch (error) {
        next(error);
    }
};


// Update cartItem 
const updateCartItem = async (req, res, next) => {
    try {
        if (req.body.price || req.body.quantity) {
            req.body.total = req.body.price * req.body.quantity;
        }

        const updatedItem = await CartItemModel.findByIdAndUpdate(req.query.id, { $set: req.body });
        if (updatedItem) {
            const allItems = await CartItemModel.find({ customerId: updatedItem.customerId, status: 'pending' });
            res.status(200).json({ items: allItems });
        }
    } catch (error) {
        next(error);
    }
};

function isWithinLastMinute(date) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() -  60000); // Subtract one minute in milliseconds
    return date >= oneMinuteAgo;
}

const completePayment = async (req, res, next) => {
    try {
        // Retrieve all orders for the customer
        const customerOrders = await OrderModel.find({ customerId: req.query.customerId });

        // Check if there are any existing orders within the last minute
        const recentOrders = customerOrders.filter(order => isWithinLastMinute(order.createdAt));

        var order = {};
        // If no recent orders exist, create a new one
        if (recentOrders.length ===  0) {
            // Computing the total price for items in the order
            const allCartItems = await CartItemModel.find({ customerId: req.query.customerId, status: "pending" });
            var totalCartPrice = 0;
            allCartItems.forEach(item => totalCartPrice += item.total);

            const newOrder = new OrderModel({ customerId: req.query.customerId, totalPrice: totalCartPrice });
            order = await newOrder.save();

            const updateCartItems = await CartItemModel.updateMany(
                { status: "pending", customerId: req.query.customerId }, 
                { $set: {
                    status: "complete",
                    orderId: order._id,
                }});
        }
        // Return the most recent order or an empty array if none exists
        res.status(200).json({ message: "Payment Complete!", order: order });
    } catch (error) {

        next(error);
    }
};


  
const deleteCart = async (req, res, next) => {
    try {
        const deletedItem = await CartItemModel.findByIdAndDelete(req.query.id);

        if (deletedItem) {
            const allItems = await CartItemModel.find({ customerId: deletedItem.customerId, status: 'pending' });
            res.status(200).json({ items: allItems });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addCartItem,
    listItems,
    listAllItems,
    findByOrderId,
    completePayment,
    updateCartItem,
    deleteCart
}