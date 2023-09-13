const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const URL = 'mongodb://127.0.0.1:27017/mestodb';
const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { ERROR_DEFAULT_CODE } = require('./config/config');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/errorNotFound');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');

const app = express();

mongoose.connect(URL,{
  useNewUrlParser: true,
});

app.use(helmet());
app.use(express.json());

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  next(new NotFoundError('Такой страницы не существует'));
});

// Обрабатываем ошибки
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_DEFAULT_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});