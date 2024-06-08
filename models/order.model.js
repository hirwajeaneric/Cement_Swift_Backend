const { Schema, models, model } = require('mongoose');

const OrderSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: {
            values: ['paid', 'confirmed', 'shipped', 'recieved', 'returned', 'complaint'],
            message: '{VALUE} is not a valid status'
        },
        default: 'paid'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    customer: {
        fullName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        }
    },
    paidOn: {
        type: Date,
        required: true,
        default: new Date()
    },
    confirmedOn: {
        type: Date,
        required: false,
    },
    shippedOn: {
        type: Date,
        required: false,
    },
    recievedOn: {
        type: Date,
        required: false,
    },    
    returnedOn: {
        type: Date,
        required: false,
    },
    delivery: {
        toBeDelivered: {
            type: Boolean,
            required: false
        },
        province: {
            type: String,
            required: false,
        },
        district: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        streetAddress: {
            type: String,
            required: false,
        },
        deliveryDate: {
            type: Date,
            required: false,
        },
        delivered: {
            type: Boolean,
            required: false,
        }
    },
    complaint: { 
        complainedOn: {
            type: Date,
            required: false,
        },
        complaintTitle: {
            type: String,
            required: false,
        },
        complaintDescription: {
            type: String,
            required: false,
        }
    }
}, {
    timestamps: true
});

const CartItemModel = model('order', OrderSchema);

module.exports = CartItemModel;