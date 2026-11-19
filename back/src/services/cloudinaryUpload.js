const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function folderName(value) {
  const raw = String(value || 'prime').replace(/[^a-zA-Z0-9/_-]/g, '');
  if (!raw) return 'prime';
  return raw.startsWith('prime') ? raw : `prime/${raw}`;
}

function uploadBuffer(buffer, { folder, resourceType = 'auto' } = {}) {
  if (!isConfigured()) {
    const err = new Error('Cloudinary тохиргоо дутуу байна.');
    err.statusCode = 500;
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName(folder),
        resource_type: resourceType,
      },
      (err, uploaded) => (err ? reject(err) : resolve(uploaded))
    );
    stream.end(buffer);
  });
}

module.exports = { isConfigured, folderName, uploadBuffer };
