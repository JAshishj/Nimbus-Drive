import multer from "multer";
import { extname } from "path";
import multerS3 from "multer-s3";
import r2 from "../config/r2.js";

const upload = multer({
  storage: multerS3({
    s3: r2,
    bucket: process.env.R2_BUCKET_NAME,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // For development:
      // cb(null, `test/${req.user.userId}/${uniqueSuffix}${extname(file.originalname)}`);
      // For production:
      cb(null, `uploads/${req.user.userId}/${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
