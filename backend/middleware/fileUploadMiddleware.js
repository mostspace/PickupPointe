const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client, PutObjectCommand } = require("../utils/aws");
const { hashFilename } = require("../utils/helpers");
const sharp = require("sharp");

// Upload file to AWS S3 with given folder name
const uploadFileToAWSFolder = (folder) =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: "public-read", // Set file access control
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const folderName = folder || "storage";
        const hashedFilename = hashFilename(file.originalname);
        const fileExtension = "webp";
        console.log("saving file as:");

        cb(null, `${folderName}/${hashedFilename}.${fileExtension}`);
      },
    }),

    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(null, false);
        return cb(new Error("invalid content type", file.mimetype));
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 50 * 1024 * 1024,
      fieldSize: 50 * 1024 * 1024,
    },
  });

const upload = multer({ storage: multer.memoryStorage() });

const convertAndUploadToS3 = (folder) => {
  return async (req, res, next) => {
    try {
      if (req.file) {
        const webpBuffer = await sharp(req.file.buffer)
          .webp({ quality: 80 })
          .toBuffer();
        const hashedFilename = hashFilename(req.file.originalname);
        const fileExtension = ".webp";
        const webpFilename = hashedFilename + fileExtension;
        console.log("webpFilename", webpFilename);

        const fileKey = `${folder || "storage"}/${webpFilename}`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: webpBuffer,
          ContentType: "image/webp",
          ACL: "public-read",
        });

        const data = await s3Client.send(putObjectCommand);
        req.file.location = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      } else if (req.files) {
        const promises = req.files?.map(async (file) => {
          console.log("arrived in multiple image upload:");
          const webpBuffer = await sharp(file.buffer)
            .webp({ quality: 80 })
            .toBuffer();
          const hashedFilename = hashFilename(file.originalname);
          const fileExtension = ".webp";
          const webpFilename = hashedFilename + fileExtension;
          console.log("webpFilename", webpFilename);

          const fileKey = `${folder || "storage"}/${webpFilename}`;

          const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: webpBuffer,
            ContentType: "image/webp",
            ACL: "public-read",
          });

          const data = await s3Client.send(putObjectCommand);
          file.location = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
        });
        await Promise.all(promises);
      }
      console.log("arrived folder:", folder);
      next();
    } catch (error) {
      console.log("convertAndUploadToS3 error:", error);
      return res.status(500).json({ message: "Error processing image." });
    }
  };
};

const chatAttachmentsUploadToS3 = (folder) => {
  return async (req, res, next) => {
    try {
      if (req.file) {
        const webpBuffer = await sharp(req.file.buffer)
          .webp({ quality: 80 })
          .toBuffer();
        const hashedFilename = hashFilename(req.file.originalname);
        const fileExtension = ".webp";
        const webpFilename = hashedFilename + fileExtension;
        console.log("webpFilename", webpFilename);

        const fileKey = `${folder || "storage"}/${webpFilename}`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: webpBuffer,
          ContentType: "image/webp",
          ACL: "public-read",
        });

        const data = await s3Client.send(putObjectCommand);
        req.file.location = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      } else if (req.files) {
        const promises = req.files?.map(async (file) => {
          console.log("arrived in multiple image upload:");
          const webpBuffer = await sharp(file.buffer)
            .webp({ quality: 80 })
            .toBuffer();
          const hashedFilename = hashFilename(file.originalname);
          const fileExtension = ".webp";
          const webpFilename = hashedFilename + fileExtension;
          console.log("webpFilename", webpFilename);

          const fileKey = `${folder || "storage"}/${webpFilename}`;

          const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: webpBuffer,
            ContentType: "image/webp",
            ACL: "public-read",
          });

          const data = await s3Client.send(putObjectCommand);
          file.location = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
        });
        await Promise.all(promises);
      }
      console.log("arrived folder:", folder);
      next();
    } catch (error) {
      console.log("convertAndUploadToS3 error:", error);
      return res.status(500).json({ message: "Error processing image." });
    }
  };
};
module.exports = {
  upload,
  convertAndUploadToS3,
  uploadFileToAWSFolder,
  chatAttachmentsUploadToS3
};
