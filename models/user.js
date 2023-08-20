const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя не может быть короче 2 символов'],
    maxlength: [30, 'Имя не может быть длиннее 30 символов'],
    required: true
  },
  about: {
    type: String,
    minlength: [2, 'Информация о себе не может быть короче 2 символов'],
    maxlength: [30, 'Информация о себе не может быть длиннее 30 символов'],
    required: true
  },
  avatar: {
    type: String,
    required: true
    },
});

module.exports = mongoose.model('user', userSchema);