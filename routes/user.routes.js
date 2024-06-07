const express = require('express');
const { updateUser, deleteUser, findById, listUsers } = require('../controllers/user.controllers.js');

const router = express.Router();

router.put('/update', updateUser);
router.delete('/delete', deleteUser);
router.get('/list', listUsers);
router.get('/findById', findById);

module.exports = router;