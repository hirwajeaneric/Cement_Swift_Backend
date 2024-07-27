const { Schema, model } = require("mongoose");

const ReportSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    premium: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    surebuild: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    surecem: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    sureroad: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    surewall: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    }
}, {
    timestamps: true
});

const ReportModel = model('report', ReportSchema);

module.exports = ReportModel;