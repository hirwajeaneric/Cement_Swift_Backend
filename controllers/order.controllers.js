const CartItemModel = require('../models/cart.model.js');
const OrderModel = require('../models/order.model.js');
const ReportModel = require('../models/report.model.js');
const { updateReport } = require('../utils/helperFunctions.js');
const sendEmail = require('../utils/sendEmail.js');

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
        
        let emailSubject = `Invoice ${createdOrder._id} for ${createdOrder.totalPrice} RWF Cement Purchase from CIMERWA PLC`;
        let emailBody = `Dear ${createdOrder.customer.fullName}, \n\nThank for your order.\n\nOrder No: ${createdOrder._id}`;
        
        emailBody += `\nDate: ${new Date(createdOrder.createdAt).toDateString()}\n`;
        allUpdatedCartItems.forEach(product => {
            emailBody += `\n- ${product.productName}: ${product.quantity} units, ${product.price} RWF each = ${product.total} RWF`;
        });
        emailBody += `\nTotal: ${createdOrder.totalPrice} RWF`;
        emailBody += `\n\nDelivery address:\nProvince: ${createdOrder.delivery.province}\nDistrict: ${createdOrder.delivery.district}\nAddress: ${createdOrder.delivery.streetAddress}`
        emailBody += `\n\nWe have recieved your order, and we will notify you for confirmation shortly.\nPlease don't hesitate to reach out if you have any question.\n\nBest regards,\nCIMERWA PLC`;

        console.log(emailBody);

        await sendEmail(createdOrder.customer.email, emailSubject, emailBody);

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
        const existingOrder = await OrderModel.findById(req.query.id);
        const updatedOrder = await OrderModel.findByIdAndUpdate(req.query.id, { $set: req.body }, { new: true });
        
        var recipient = updatedOrder.customer.email;
        var subject = ``;
        var body = ``;

        if (updatedOrder.status !== existingOrder.status && updatedOrder.status === "confirmed" ) {
            subject = `Order Confirmed.`;
            body = `Dear ${updatedOrder.customer.fullName}, \n\nYour order No ${updatedOrder._id} of cement worth: ${updatedOrder.totalPrice} RWF has been confirmed and will be shipped and delivered on ${new Date(updatedOrder.delivery.deliveryDate).toDateString()}. \n\nWe will start processing your order shortly.\nPlease keep an eye on your order status. \n\nPlease don't hesitate to reach out if you have any question.\n\nBest regards,\nCIMERWA PLC`;
            await sendEmail(recipient, subject, body);
        }

        if (updatedOrder.status !== existingOrder.status && updatedOrder.status === "shipped") {
            subject = `Order Shipped.`;
            body = `Dear ${updatedOrder.customer.fullName}, \n\nYour order No ${updatedOrder._id} of cement worth: ${updatedOrder.totalPrice} RWF has just been shipped for delivery and delivered.\n\nDelivery address:\nProvince: ${updatedOrder.delivery.province}\nDistrict: ${updatedOrder.delivery.district}\nAddress: ${updatedOrder.delivery.streetAddress} \n\nShipments may take between 5 to 20 hours to reach you according to your location. \n\nOnce delivery reaches you or is near your location, our delivery agent will notify you. \n\nPlease keep an eye on your order status. \nPlease don't hesitate to reach out if you have any question.\n\nBest regards,\nCIMERWA PLC`;
            await sendEmail(recipient, subject, body);
        }

        console.log(body);

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