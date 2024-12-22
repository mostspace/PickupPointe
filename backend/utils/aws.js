const {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  regision: process.env.AWS_S3_BUCKET_NAME,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getBucketAndKeyFromUrl = (s3Url) => {
  try {
    console.log("typeof s3Url", typeof s3Url, s3Url);
    if (typeof s3Url === "undefined") {
      return;
    }
    const url = new URL(s3Url);
    const hostname = url.hostname;
    const pathname = url.pathname;

    const bucketName = hostname.split(".")[0];
    const key = pathname.startsWith("/") ? pathname.slice(1) : pathname;

    return { bucketName, key };
  } catch (error) {
    console.log("getBucketAndKeyFromUrl function.", error);
  }
};

const deleteFileFromS3UsingURL = async (fileUrl) => {
  if (typeof fileUrl === "undefined" || fileUrl === "") {
    return;
  }
  const { bucketName, key } = getBucketAndKeyFromUrl(fileUrl);
  if (typeof bucketName === "undefined" || typeof key === "undefined") {
    return;
  }
  console.log(bucketName, key);

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);

    await s3Client.send(command);

    console.log(
      `File at location ${fileUrl} deleted successfully from bucket ${bucketName}`
    );
  } catch (error) {
    console.log("deleteFileFromS3 function.", error);
  }
};

module.exports = {
  s3Client,
  PutObjectCommand,
  getBucketAndKeyFromUrl,
  deleteFileFromS3UsingURL,
};
