const { Schema, model } = require("mongoose");

const ReportSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    "Premium 42,5": {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    "Surebuild": {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    "Surecem": {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    "Sureroad": {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    "Surewall": {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    }
}, {
    timestamps: true
});

const ReportModel = model('report', ReportSchema);

module.exports = ReportModel;