const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/errorConflict');
const RequestError = require('../errors/errorRequest');
const NotFoundError = require('../errors/errorNotFound');
const {
  RIGHT_CODE,
  CREATED_CODE,
  SALT_COUNT,
  KEY
} = require('../config/config');


const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(RIGHT_CODE).send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`Пользователь по указанному _id (${ userId }) не найден`);
    })
    .then(user => res.status(RIGHT_CODE).send({ data: user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new RequestError('Переданы некорректные данные пользователя'));
      }
      return next(e);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => {
      res.status(RIGHT_CODE).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, SALT_COUNT)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(CREATED_CODE).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError('Этот email уже зарегистрирован'));
      } else if (e instanceof mongoose.Error.ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        next(new RequestError(message));
      } else {
        next(e);
      }
    });
};

const updateProfile = (req, res, next, newData) => {
  User.findByIdAndUpdate(
    req.user._id,
    newData,
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ).orFail(() => {
    throw new NotFoundError(`Пользователь с указанным _id (${ req.user._id }) не найден`);
  })
    .then(user => {
      res.status(RIGHT_CODE).send({ data: user });
    })
    .catch(next);
};

const updateProfileInfo = (req, res, next) => {
  const { name, about } = req.body;
  return updateProfile(req, res, next, { name, about });
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return updateProfile(req, res, next, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, KEY, { expiresIn: '7d' });
      res.status(RIGHT_CODE).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateProfileInfo,
  updateProfileAvatar,
  login,
};


