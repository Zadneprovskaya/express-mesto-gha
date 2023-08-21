const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Название не может быть короче 2 символов'],
      maxlength: [30, 'Название не может быть длиннее 30 символов'],
    },

    link: {
      type: String,
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Некорректный URL',
      },
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);