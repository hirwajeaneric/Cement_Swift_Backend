const ReportModel = require('../models/report.model');

const list = async (req, res, next) => {
    try {
        const items = await ReportModel.find();
        res.status(200).json({ items });
    } catch (error) {
        next(error);
    }
}

const findByYear = async (req, res, next) => {
    try {
        const items = await ReportModel.find({ year: req.query.year });
        res.status(200).json({ items });
    } catch (error) {
        next(error);
    }
}

const deleteReport = async (req, res, next) => {
    try {
        const deletedItem = await ReportModel.findByIdAndDelete(req.query.id);
        if (deletedItem) {
            res.status(200).json({ message: 'Report deleted successfully' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    list, 
    findByYear,
    deleteReport
}