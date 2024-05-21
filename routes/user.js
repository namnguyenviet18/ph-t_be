
const router = require('express').Router();
const userController = require('../controllers/user_controller');
const { verifyUser } = require('../middleware/verify_user');
router.post('/login', userController.loginUser);
router.post('/user', userController.createUser);
router.get('/userList', verifyUser, userController.getUserForSideBar);
router.get('/userDetail/:id', verifyUser, userController.getUserDetailsById);

module.exports = router;