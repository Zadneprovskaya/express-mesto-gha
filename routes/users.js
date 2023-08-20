const express = require('express');

const {
  createUser,
  getUsers,
  getUser,
  updateProfileInfo,
  updateProfileAvatar,
} = require('../controllers/users');
const userRouter = express.Router();

// создать пользователя
userRouter.post('/users', createUser);

// вернуть всех пользователей
userRouter.get('/users', getUsers);

// вернуть пользователя по _id
userRouter.get('/users/:userId', getUser);

// обновить профиль
userRouter.patch('/users/me', updateProfileInfo);

// обновить аватар
userRouter.patch('/users/me/avatar', updateProfileAvatar);

module.exports = {userRouter};