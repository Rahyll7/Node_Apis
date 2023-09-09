const express = require('express');
const router = express.Router();
const Data = require('../models/data');

router.post('/', async (req, res) => {
  try {
    const { search_key, skip, limit, sort, tags } = req.body;
    const query = {};

    if (search_key) {
      query.name = { $regex: new RegExp(search_key, 'i') };
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    const results = await Data.aggregate([
      { $match: query },
      { $sort: { date: sort } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          encrypted_image_url: 0,
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
