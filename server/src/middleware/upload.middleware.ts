import multer from "multer";

const storage = multer.memoryStorage();
const imageFileNamePattern = /\.(jpe?g|png|gif|webp)$/i;

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    console.log("Multer received file:");
    console.log({
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    // Some clients (including Postman on certain Windows setups) send a valid
    // image file as text/plain. The file bytes are verified after Multer has
    // read the upload, so accept a recognised image filename here as well.
    if (
      !file.mimetype.startsWith("image/") &&
      !imageFileNamePattern.test(file.originalname)
    ) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
  },
});
