const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { requireAdmin } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|gif|webp|svg\+xml)|application\/pdf)$/.test(file.mimetype);
    cb(ok ? null : new Error('Зөвхөн зураг эсвэл PDF оруулна.'), ok);
  },
});

function folderName(value) {
  const raw = String(value || 'prime').replace(/[^a-zA-Z0-9/_-]/g, '');
  if (!raw) return 'prime';
  return raw.startsWith('prime') ? raw : `prime/${raw}`;
}

const router = express.Router();

router.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary тохиргоо дутуу байна.' });
  }
  if (!req.file) return res.status(400).json({ message: 'Файл олдсонгүй.' });
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderName(req.body?.folder),
          resource_type: 'auto',
        },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });
    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Cloudinary upload амжилтгүй.' });
  }
});

module.exports = router;
