const bcryptjs = require("bcryptjs");
const UserModel = require('../models/user.model.js');

// Update user 
const updateUser = async (req, res, next) => {
    console.log(req.body);
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.query.id,
            {
                $set: req.body
            },
            {
                new: true,
            }
        );

        console.log(updatedUser);

        if (updatedUser) {
            const { password,...rest } = updatedUser._doc;
            res.status(200).json({ user: rest, message: 'Successfully Updated Account' });
        }
    } catch (error) {
        next(error);
    }
};

const listUsers = async (req, res, next) => {
    try {
        const clients = await UserModel.find({});
        res.status(200).json({
            clients: clients
        });
    } catch (error) {
        next(error);
    }
}

const findById = async (req, res, next) => {
    try {
        const foundUser = await UserModel.findById(req.query.id);
        if (foundUser) {
            res.status(200).json({
                user: foundUser
            });
        }
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    updateUser,
    deleteUser,
    listUsers,
    findById
}