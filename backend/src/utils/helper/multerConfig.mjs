import multer from "multer";
import path from "path";
import fs from "fs";

export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = `profile-image/${req.user._id}`;

    try {
      await fs.promises.mkdir(dir, { recursive: true });

      // ? Memastikan bahwa directory ini hanya memiliki 1 file saja
      const existingFile = await fs.promises.readdir(dir);
      if (existingFile.length > 0) {
        const existingFilePath = path.join(dir, existingFile[0]);
        await fs.promises.unlink(existingFilePath);
      }

      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const randomFileName = `${req.user.id}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, randomFileName);
  },
});

export const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"), false);
  }
};

export const videoStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = `course-videos/${req.body.courseId}/${req.body.title}`;

    try {
      await fs.promises.mkdir(dir, { recursive: true });

      // ? Memastikan bahwa directory ini hanya memiliki 1 file saja
      const existingFile = await fs.promises.readdir(dir);
      if (existingFile.length > 0) {
        const existingFilePath = path.join(dir, existingFile[0]);
        await fs.promises.unlink(existingFilePath);
      }

      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const randomFileName = `${req.body.courseId}-${
      req.body.title
    }-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, randomFileName);
  },
});

export const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    const error = new Error("Only .mp4 and .mkv formats are allowed!");
    cb(error, false);
  }
};

export const courseImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = `course-image/`;

    try {
      await fs.promises.mkdir(dir, { recursive: true });

      // ? Memastikan bahwa directory ini hanya memiliki 1 file saja
      const existingFile = await fs.promises.readdir(dir);
      if (existingFile.length > 0) {
        const existingFilePath = path.join(dir, existingFile[0]);
        await fs.promises.unlink(existingFilePath);
      }

      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const randomFileName = `courseImage-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, randomFileName);
  },
});

export const courseImageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    const error = new Error("Only .jpg, .jpeg and .png formats are allowed!");
    cb(error, false);
  }
};
