const express = require('express');
const { updateUser, deleteUser, findById, listUsers, listClients } = require('../controllers/user.controllers.js');

const router = express.Router();

router.put('/update', updateUser);
router.delete('/delete', deleteUser);
router.get('/list', listUsers);
router.get('/clients', listClients);
router.get('/findById', findById);

module.exports = router;