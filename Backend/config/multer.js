import { multer, diskStorage } from "multer";
import multerS3 from "multer-s3";
import { r2 } from "./r2";
import { join, extname } from "path";
import { mkdir } from "fs/promises";

const storage = diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userDir = join("uploads", req.user.userId);
      await mkdir(userDir, { recursive: true });
      cb(null, userDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/*const upload = multer({
  storage: multerS3({
    s3: r2,
    bucket: process.env.R2_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
*/

export default upload;
