const { ObjectId } = require("mongodb");
const connection = require("../../db");
const fs = require("fs");

async function readFile(collName, _id, filePathFieldName, res) {
  try {
    const col = (await connection).db().collection(collName);
    const doc = await col.findOne({ _id: ObjectId(_id) });
    if (!doc) return res.status(400).send("File not found!");
    res.contentType("application/pdf");
    return res.send(fs.readFileSync(doc[filePathFieldName]));
  } catch (error) {
    console.error(error);
    if (error.response) return res.status(500).send(error.response.data);
    return res.status(500).send(error.toString());
  }
}

async function updateFilterStatus(req, res, collName) {
  try {
    const { _id, status } = req.body;
    const col = (await connection).db().collection(collName);
    await col.updateOne({ _id: ObjectId(_id) }, { $set: { status } });
    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    if (error.response) return res.status(500).send(error.response.data);
    return res.status(500).send(error.toString());
  }
}

module.exports = { readFile, updateFilterStatus };
