const { z } = require("zod");

const uploadFileSchema = z.object({
  folder: z.string(),
});

const downloadFileSchema = z.object({
  encodedFileDest: z.string(),
});

const signReadUrlSchema = z.object({
  fileDest: z.string(),
  expireIn: z.string().nullable().default(null),
});

const readFileBySignedUrlSchema = z.object({
  token: z.string(),
});


const deleteFileSchema = z.object({
  encodedFileDest: z.string(),
});

module.exports = { uploadFileSchema, downloadFileSchema, signReadUrlSchema, readFileBySignedUrlSchema, deleteFileSchema };
