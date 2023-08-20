const express = require('express');
const mongoose = require('mongoose');
const URL = 'mongodb://127.0.0.1:27017/mestodb';
const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { ERROR_DEFAULT_CODE } = require('./config/config');

const app = express();

mongoose.connect(URL,{
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64df2fda6719c217c8b02254'
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(ERROR_DEFAULT_CODE).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});