import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

/*
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      cb(null, "./public/temp"); // Assuming the directory exists
    } catch (err) {
      cb(err);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    } catch (err) {
      cb(err);
    }
  },
});
*/
