const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { appEnv } = require("../../config/env");
const { MB } = require("../../constant");
const { handlerWrapper } = require("../../common/utils");
const { uploadFileSchema, downloadFileSchema, signReadUrlSchema, readFileBySignedUrlSchema, deleteFileSchema } = require("./schema");
const { InputDataInvalid } = require("../../qa/errors");
const { authen, author } = require("../../access-control/protect-middleware");
const { Roles } = require("../../access-control/role");

const upload = multer({ limits: { fieldSize: appEnv.REQUEST_SIZE_LIMIT_IN_MB * MB } });

router.post(
  "/upload",
  authen,
  author([Roles.WRITER]),
  upload.single("file"),
  handlerWrapper(async (req, res) => {
    const { folder } = uploadFileSchema.parse(req.body);
    // check if file is present
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) throw new InputDataInvalid({ message: "file là bắt buộc!" });

    const fileName = req.file.originalname;
    // TODO: fix postman filename problem...
    console.log("🚧 --> handlerWrapper --> fileName:", req.file);
    // check if file existed --> error
    const filePath = path.join(appEnv.BASE_FOLDER_PATH, folder, fileName);
    if (fs.existsSync(filePath)) {
      return res.status(409).json({ message: "File đã tồn tại!" });
    }

    // write file to file system
    const folderPath = path.join(appEnv.BASE_FOLDER_PATH, folder);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(filePath, fileBuffer);

    const fileDest = path.join(folder, fileName);
    return res.send({ fileDest });
  })
);

router.get(
  "/download",
  authen,
  author([Roles.READER, Roles.WRITER]),
  handlerWrapper(async (req, res) => {
    const { encodedFileDest } = downloadFileSchema.parse(req.query);
    const fileDest = decodeURIComponent(encodedFileDest);
    const filePath = path.join(appEnv.BASE_FOLDER_PATH, fileDest);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File không tồn tại!" });
    }
    return res.download(filePath);
  })
);

router.post(
  "/sign-read-url",
  authen,
  author([Roles.READER, Roles.WRITER]),
  handlerWrapper(async (req, res) => {
    const { fileDest, expireIn } = signReadUrlSchema.parse(req.body);
    const filePath = path.join(appEnv.BASE_FOLDER_PATH, fileDest);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File không tồn tại!" });
    }
    const duration = expireIn ?? appEnv.SIGNED_URL_EXPIRE_IN;
    const tokenContent = { fileDest };
    const token = jwt.sign(tokenContent, appEnv.JWT_SECRET, { expiresIn: duration });
    const signedUrl = `${appEnv.FILE_SERVER_ENDPOINT}/read?token=${token}`;
    return res.json({ signedUrl });
  })
);

router.get(
  "/read",
  handlerWrapper(async (req, res) => {
    const { token } = readFileBySignedUrlSchema.parse(req.query);
    const decoded = jwt.verify(token, appEnv.JWT_SECRET);
    const { fileDest } = decoded;
    const filePath = path.join(appEnv.BASE_FOLDER_PATH, fileDest);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File không tồn tại!" });
    }
    return res.download(filePath);
  })
);

router.delete(
  "/delete-file",
  authen,
  author([]),
  handlerWrapper(async (req, res) => {
    const { encodedFileDest } = deleteFileSchema.parse(req.query);
    const fileDest = decodeURIComponent(encodedFileDest);
    const filePath = path.join(appEnv.BASE_FOLDER_PATH, fileDest);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File không tồn tại!" });
    }
    fs.rmSync(filePath);
    return res.sendStatus(204);
  })
);


module.exports = router;
