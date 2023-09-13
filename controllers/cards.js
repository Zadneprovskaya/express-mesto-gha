const mongoose = require('mongoose');
const Card = require('../models/card');
const RequestError = require('../errors/errorRequest');
const NotFoundError = require('../errors/errorNotFound');
const NotOwnerError = require('../errors/errorNotOwner');
const {
  RIGHT_CODE,
  CREATED_CODE,
} = require('../config/config');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(RIGHT_CODE).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new RequestError('Переданы некорректные данные id карточки'));
      } else {
        next(e);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError(`Карточка с указанным _id (${ cardId }) не найдена`);
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card.owner.equals(ownerId)) {
        throw new NotOwnerError('Невозможно удалить чужую карточку');
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.status(RIGHT_CODE).send({ data: card });
          })
          .catch(next);
      }
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new RequestError('Переданы некорректные данные id карточки'));
      } else {
        next(e);
      }
    });
};

const updateLikes = (req, res, next, newData) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    newData,
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(RIGHT_CODE).send({ data: card });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new RequestError('Переданы некорректные данные о карточке'));
      } else {
        next(e);
      }
    });
};

const likeCard = (req, res, next) => {
  const countLikes = { $addToSet: { likes: req.user._id } };
  return updateLikes(req, res, next, countLikes);
};

const dislikeCard = (req, res, next) => {
  const countLikes = { $pull: { likes: req.user._id } };
  return updateLikes(req, res, next, countLikes);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
