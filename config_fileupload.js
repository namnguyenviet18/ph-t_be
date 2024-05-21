
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dee2s8sgk',
    api_key: '733744556338287',
    api_secret: 'KfsJY5dgQutqpkYmMBV7Kkn9kE0',
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Tên thư mục trên Cloudinary để lưu trữ ảnh
        allowedFormats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
