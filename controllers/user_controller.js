
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const user = require('../models/user');
require('dotenv').config();

module.exports = {
    createUser: async (req, res) => {
        try {
            if (req.body.password.length < 8) {
                return res.status(400).json({ status: false, msg: "Password should be at lease 8 characters." });
            }

            const loginNameExist = await User.findOne({ login_name: req.body.login_name });
            if (loginNameExist) {
                return res.status(400).json({ status: false, msg: "Login name already exist." });
            }

            const newUser = new User({
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                location: req.body.location,
                description: req.body.description,
                occupation: req.body.occupation,
                login_name: req.body.login_name,
                password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString()
            });

            await newUser.save();

            res.status(201).json({ status: true, msg: "User successfully created" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: true, msg: err.message });
        }
    },

    loginUser: async (req, res) => {
        try {

            console.log(process.env.SECRET);

            const user = await User.findOne({ login_name: req.body.login_name });

            if (!user) {
                return res.status(400).json({ status: false, msg: "Account is not registered." });
            }

            const decryptPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword = decryptPassword.toString(CryptoJS.enc.Utf8);

            if (depassword !== req.body.password) {
                return res.status(400).json({ status: false, msg: "Wron password." });
            }

            const userToken = jwt.sign({
                id: user._id,
                login_name: user.login_name
            }, process.env.JWT_SECRET, { expiresIn: "21d" });

            const { password, ...other } = user._doc;
            res.status(200).json({ other, userToken });
        } catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    },

    getUserForSideBar: async (req, res) => {
        try {
            const userData = await User.find({}, '_id first_name last_name');
            if (!userData) {
                return res.status(400).json({ status: false, msg: "User not found." });
            }
            return res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    },

    getUserDetailsById: async (req, res) => {
        try {

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(400).json({ staus: false, msg: "Đã xảy ra sự cố, vui lòng thử lại!" });
            }
            const { password, __v, login_name, ...other } = user._doc;

            res.status(200).json(other);
        } catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    }
}