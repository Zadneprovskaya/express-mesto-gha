const express = require('express');
const { validateCreateCard, validateUpdateCard } = require('../middlewares/validation');

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
cardRouter.post('/cards', validateCreateCard, createCard);

// удалить карточку по _id
cardRouter.delete('/cards/:cardId', validateUpdateCard, deleteCard);

// поставить лайк карточке по _id
cardRouter.put('/cards/:cardId/likes', validateUpdateCard, likeCard);

// убрать лайк с карточки по _id
cardRouter.delete('/cards/:cardId/likes', validateUpdateCard, dislikeCard);

module.exports = { cardRouter };
