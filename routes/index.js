const express = require("express");
const router = express.Router();

const path = require("path");
const STORAGE_BASE_FOLDER = path.join(__dirname, "storage");

const multer = require("multer");
const upload = multer({ limits: { fieldSize: 50000000 } });

const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/tmp/my-uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

router.post("write", upload.single("file"), async (req, res) => {
  try {
    const folder = req.body.folder;
    const today = new Date().toISOString().split("T")[0];
    const folderPath = path.join(STORAGE_BASE_FOLDER, folder, today);

    const originalName = req.file.originalname;
    const fileName = Date.now() + "__" + originalName;

    const filePath = path.join(folderPath, fileName);
    const buffer = req.file.buffer;
    fs.writeFileSync(filePath, buffer);

    return res.send({ filePath });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.toString());
  }
});

router.get("read", async (req, res) => {
  try {
    res.contentType("application/pdf");
    return res.send(fs.readFileSync(req.query.filePath));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.toString());
  }
});

module.exports = router;
