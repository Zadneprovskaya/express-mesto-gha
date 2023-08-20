const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  RIGHT_CODE,
  CREATED_CODE,
  ERROR_CODE,
  NOT_FOUND_CODE,
  ERROR_DEFAULT_CODE
} = require('../config/config');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(RIGHT_CODE).send({ data: cards }))
    .catch(err => res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch(err => {
      if (err.name === 'ValidationError')  {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      res.status(NOT_FOUND_CODE).send({ message: `Карточка с указанным _id (${ cardId }) не найдена` });
    })
    .populate(['owner', 'likes'])
    .then((card) => {
        Card.deleteOne(card)
          .then(() => {
            res.status(RIGHT_CODE).send({ data: card });
          })
          .catch(err => res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' }));
      })
    .catch(err => res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' }));
};

const updateLikes = (req, res, newData) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    newData,
    { new: true },
  )
    .orFail(() => {
      res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий _id (${req.params.cardId}) карточки` })
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(RIGHT_CODE).send({ data: card });
    })
    .catch(err => {
      if (err.name === 'ValidationError')  {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  const countLikes = { $addToSet: { likes: req.user._id } };
  return updateLikes(req, res, countLikes);
};

const dislikeCard = (req, res) => {
  const countLikes = { $pull: { likes: req.user._id } };
  return updateLikes(req, res, countLikes);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
