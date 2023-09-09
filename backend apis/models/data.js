const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  input_type: {
    type: String,
    enum: ['text', 'number', 'file'],
    required: true,
  },
  file_type: {
    type: String,
    required: function () {
      return this.input_type === 'file';
    },
  },
  tags: [String],
  encrypted_image_url: String, 
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Data', dataSchema);
