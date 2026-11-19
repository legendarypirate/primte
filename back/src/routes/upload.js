const express = require('express');
const multer = require('multer');
const { requireAdmin } = require('../middleware/auth');
const { isConfigured, uploadBuffer } = require('../services/cloudinaryUpload');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|gif|webp|svg\+xml)|application\/pdf)$/.test(file.mimetype);
    cb(ok ? null : new Error('Зөвхөн зураг эсвэл PDF оруулна.'), ok);
  },
});

const router = express.Router();

router.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  if (!isConfigured()) {
    return res.status(500).json({ message: 'Cloudinary тохиргоо дутуу байна.' });
  }
  if (!req.file) return res.status(400).json({ message: 'Файл олдсонгүй.' });
  try {
    const result = await uploadBuffer(req.file.buffer, {
      folder: req.body?.folder,
      resourceType: 'auto',
    });
    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Cloudinary upload амжилтгүй.' });
  }
});

module.exports = router;
