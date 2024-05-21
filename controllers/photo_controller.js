
const Photo = require('../models/Photo');
const { populate } = require('../models/user');
const { cloudinary } = require('../config_fileupload.js');



module.exports = {
  getPhotosOfUser: async (req, res) => {
    try {
      const photos = await Photo.find({ user_id: req.params.id }).populate({
        path: 'comments.user_id',
        select: '_id first_name last_name'
      });

      if (!photos) {
        return res.status(400).json({ message: 'No photos found for the user' });
      }

      photos.forEach(photo => {
        photo.comments.sort((a, b) => b.date_time - a.date_time);
      });

      res.json(photos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  uploadPhoto: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ status: false, msg: "Image upload failed" });
      }
      const newPhoto = new Photo({
        file_name: file.path,
        user_id: req.user.id,
        comments: []
      });

      await newPhoto.save();

      res.status(200).json({ status: true, msg: "Photo upload was successfully" });

    } catch (err) {
      res.status(500).json({ status: true, msg: err.message });

    }
  },

  addComment: async (req, res) => {

    try {

      console.log(req.body.comment);
      const newComment = {
        comment: req.body.comment,
        user_id: req.user.id,
        date_time: new Date()
      };

      const photo = await Photo.findById(req.params.photo_id);
      if (!photo) {
        return res.status(404).json({ status: false, msg: "Photo not found" });
      }

      photo.comments.push(newComment);
      await photo.save();
      console.log(photo);
      res.status(200).json({ status: true, msg: "Comment successfully sent!", cmtid: photo.comments[photo.comments.length - 1]._id });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: false, msg: err.message });
    }
  },

  deleteComment: async (req, res) => {
    console.log(req.body.photo_id);
    try {
      const photo = await Photo.findById(req.body.photo_id);
      if (!photo) {
        return res.status(404).json({ status: false, msg: "Photo not found" });
      }

      const index = photo.comments.findIndex(comment => comment._id.toString() === req.body.comment_id);
      if (index === -1) {
        return res.status(404).json({ status: false, msg: "'Comment not found in the photo'" });
      }

      photo.comments.splice(index, 1);

      await photo.save();

      res.status(200).json({ status: true, msg: "Deleted successfully!" });

    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: false, msg: err.message });
    }
  },

  deletePhoto: async (req, res) => {


    try {
      const photo = await Photo.findById(req.params.id);
      if (!photo) {
        return res.status(404).json({ status: false, msg: "Photo not found" });
      }

      // Delete the photo from Cloudinary
      const publicId = "uploads/" + photo.file_name.split('/').pop().split('.')[0];
      console.log(publicId + " " + photo.file_name);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(result);
      await Photo.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: true, msg: "Photo deleted successfully" });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: false, msg: err.message });
    }
  }
}