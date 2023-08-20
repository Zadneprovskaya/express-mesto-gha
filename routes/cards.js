const express = require('express');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

// вернуть все карточки
cardRouter.get('/cards', getCards);

// создать карточку
cardRouter.post('/cards', createCard);

// удалить карточку по _id
cardRouter.delete('/cards/:cardId', deleteCard);

// поставить лайк карточке по _id
cardRouter.put('/cards/:cardId/likes', likeCard);

// убрать лайк с карточки по _id
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = {cardRouter};
