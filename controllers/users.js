const mongoose = require('mongoose');
const User = require('../models/user');
const {
  RIGHT_CODE,
  ERROR_CODE,
  NOT_FOUND_CODE,
  ERROR_DEFAULT_CODE
} = require('../config/config');



const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(RIGHT_CODE).send({ data: users }))
    .catch(err => res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      res.status(NOT_FOUND_CODE).send({ message: `Пользователь по указанному _id (${ userId }) не найден` });
    })
    .then(user => res.status(RIGHT_CODE).send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError')  {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные пользователя' });
      }
      else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then(user => {
    const { _id } = user;
    res.status(RIGHT_CODE).send({ data: { name, about, avatar, _id }})
  })
  .catch(err => {
    if (err.name === 'ValidationError')  {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    else {
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
    }
  });
};

const updateProfile = (req, res, newData) => {
  User.findByIdAndUpdate(
    req.user._id,
    newData,
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ).orFail(() => {
    res.status(NOT_FOUND_CODE).send({ message: `Пользователь с указанным _id (${ req.user._id }) не найден` });
  })
    .then(user => {
      res.status(RIGHT_CODE).send({ data: user });
    })
    .catch(err => {
      if (err.name === 'ValidationError')  {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля или аватара' });
      }
      else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;
  return updateProfile(req, res, { name, about });
};

const updateProfileAvatar = (req, res) => {
  const { avatar } = req.body;
  return updateProfile(req, res, { avatar });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfileInfo,
  updateProfileAvatar,
};


