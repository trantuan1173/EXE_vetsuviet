const {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const hasStorageConfig = Boolean(
  process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
);

const s3Client = hasStorageConfig
  ? new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    })
  : null;

const bucket = process.env.S3_BUCKET || 'videos';
const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT;

const toPublicSignedUrl = (signedUrl) => {
  if (!signedUrl || !publicEndpoint || publicEndpoint === process.env.S3_ENDPOINT) {
    return signedUrl;
  }

  const internalUrl = new URL(signedUrl);
  const browserUrl = new URL(publicEndpoint);
  internalUrl.protocol = browserUrl.protocol;
  internalUrl.host = browserUrl.host;
  return internalUrl.toString();
};

const ensureStorageReady = () => {
  if (!s3Client) throw new Error('Storage is not configured');
};

const ensureBucket = async () => {
  ensureStorageReady();
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
  }
};

const createMultipartUpload = async ({ key, contentType }) => {
  ensureStorageReady();
  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return s3Client.send(command);
};

const getUploadPartSignedUrl = async ({ key, uploadId, partNumber }) => {
  ensureStorageReady();
  const command = new UploadPartCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  return toPublicSignedUrl(signedUrl);
};

const completeMultipartUpload = async ({ key, uploadId, parts }) => {
  ensureStorageReady();
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });
  return s3Client.send(command);
};

const abortMultipartUpload = async ({ key, uploadId }) => {
  ensureStorageReady();
  const command = new AbortMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
  });
  return s3Client.send(command);
};

const deleteObject = async (key) => {
  if (!key || !s3Client) return;
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

const getSignedPlaybackUrl = async (key, expiresInSeconds) => {
  ensureStorageReady();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  return toPublicSignedUrl(signedUrl);
};

module.exports = {
  bucket,
  ensureBucket,
  createMultipartUpload,
  getUploadPartSignedUrl,
  completeMultipartUpload,
  abortMultipartUpload,
  deleteObject,
  getSignedPlaybackUrl,
};
