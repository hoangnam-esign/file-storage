const { z } = require("zod");

const uploadFileSchema = z.object({
  folder: z.string(),
});

const downloadFileSchema = z.object({
  encodedFileDest: z.string(),
});

const signReadUrlSchema = z.object({
  fileDest: z.string(),
  expireIn: z.string().nullable(),
});

const readFileBySignedUrlSchema = z.object({
  token: z.string(),
});

module.exports = { uploadFileSchema, downloadFileSchema, signReadUrlSchema, readFileBySignedUrlSchema };
