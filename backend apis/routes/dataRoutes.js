const express = require("express");
const router = express.Router();
const Data = require("../models/data");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const encryptionKey = crypto.randomBytes(32).toString("hex");
    console.log("Encryption Key:", encryptionKey);

    const { name, input_type, file_type, tags, file, date } = req.body;

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );

    let encryptedImageURL = iv.toString("hex");
    encryptedImageURL += cipher.update(file, "utf8", "hex");
    encryptedImageURL += cipher.final("hex");

    console.log(encryptedImageURL, "encryptedImageURL");

    const objectId = new mongoose.Types.ObjectId();

    const fileName = `${name}_${objectId}.txt`;
    const filePath = path.join("encrypted_key_for_each _user", fileName);

    fs.writeFileSync(
      filePath,
      `Name: ${name}\nEncryption Key: ${encryptionKey}\nObject ID: ${objectId}`
    );

    const newData = new Data({
      name,
      input_type,
      file_type,
      tags,
      encrypted_image_url: encryptedImageURL,
      date,
      objectId,
    });

    const savedData = await newData.save();

    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
