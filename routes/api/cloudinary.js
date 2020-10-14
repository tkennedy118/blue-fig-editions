const router = require('express').Router();
const path = require('path');
const isAdmin = require('../../config/middleware/isAdmin');

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

router.route('/upload-image')
  .post(isAdmin, async (req, res) => {

    try {
      const fileStr = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: process.env.CLOUDINARY_PRESET
      });
      res.json({ url: uploadResponse.url });

    } catch (error) {
      res.status({ error: error });
    }
  });

module.exports = router;
