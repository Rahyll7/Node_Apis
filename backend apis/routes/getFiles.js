const express = require("express");
const router = express.Router();
const Data = require("../models/data");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

router.get("/get-file", async (req, res) => {
  try {
    const id = req.query.id;
    const decryptionKey = req.body.decryptionKey;

    console.log("ID:", id);

    const data = await Data.findById(id);

    if (!data || data.input_type !== "file") {
      return res.status(404).json({ message: "File not found." });
    }

    const ivHex = data.encrypted_image_url.substring(0, 32);
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(decryptionKey, "hex"),
      Buffer.from(ivHex, "hex")
    );

    const encryptedDataHex = data.encrypted_image_url.substring(32);

    let decryptedImageURLBuffer = Buffer.concat([
      decipher.update(Buffer.from(encryptedDataHex, "hex")),
      decipher.final(),
    ]);
    const decryptedImageURL = decryptedImageURLBuffer.toString("utf8");

    const fileName = `${id}_${data.name}.txt`;
    const filePath = path.join("temp", fileName);

    fs.writeFileSync(filePath, decryptedImageURL);

    res.json({ decryptedFileUrl: decryptedImageURL });
  } catch (error) {
    console.error("Error:", error);

    if (error.code === "ERR_OSSL_BAD_DECRYPT") {
      return res
        .status(400)
        .json({ message: "Bad decrypt: Incorrect decryption key or data." });
    }

    res.status(500).json({ message: "An error occurred." });
  }
});

module.exports = router;
