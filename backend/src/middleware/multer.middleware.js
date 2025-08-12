import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',   // JPEG
    'image/png',    // PNG
    'image/gif',    // GIF (optional)
    'image/webp',   // WEBP (optional)
    'video/mp4'     // MP4
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp) and mp4 videos are allowed'), false);
  }
};

export const uploadMiddleware = multer({ storage, fileFilter });
