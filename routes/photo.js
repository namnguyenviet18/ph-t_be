const { verify } = require('jsonwebtoken');

const router = require('express').Router();
const { verifyUser } = require('../middleware/verify_user');
const { upload } = require('../config_fileupload.js');
const photoController = require('../controllers/photo_controller');



router.post('/new', verifyUser, upload.single('file'), photoController.uploadPhoto);
router.get('/photoOfUser/:id', verifyUser, photoController.getPhotosOfUser);
router.post('/commentsOfPhoto/:photo_id', verifyUser, photoController.addComment);
router.post('/deleteComment', verifyUser, photoController.deleteComment);
router.get('/delete/:id', verifyUser, photoController.deletePhoto);
module.exports = router;