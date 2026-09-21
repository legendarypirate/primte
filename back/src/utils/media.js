const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadLocal(fileName, folder = 'prime/seed') {
  const filePath = path.join(__dirname, '../../uploads', fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing upload file: ${fileName}`);
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: path.parse(fileName).name,
    overwrite: true,
    resource_type: 'image',
  });
  return result.secure_url;
}

module.exports = { cloudinary, uploadLocal };
