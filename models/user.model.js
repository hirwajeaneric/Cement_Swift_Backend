const { Schema, model } = require('mongoose');

const useSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['client', 'admin', 'deliverer'],
            message: 'Role must be client or admin'
        },
        default: 'client'
    }
 }, {
    timestamps: true
 });

 const User = model('user', useSchema);

 module.exports = User;