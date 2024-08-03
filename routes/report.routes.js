const express = require('express');
const { list, findByYear, deleteReport } = require('../controllers/report.controllers.js');

const router = express.Router();

router.get('/list', list);
router.get('/findByYear', findByYear);
router.delete('/delete', deleteReport);

module.exports = router;