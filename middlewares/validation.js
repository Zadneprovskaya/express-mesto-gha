const { celebrate, Joi } = require('celebrate');
const { REGULAR_URL, REGULAR_ID } = require('../config/config');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGULAR_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(REGULAR_ID),
  }),
});

const validateUpdateProfileInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateProfileAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(REGULAR_URL),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(REGULAR_URL),
  }),
});

const validateUpdateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(REGULAR_ID),
  }),
});

module.exports = {
  validateLogin,
  validateCreateUser,
  validateGetUser,
  validateUpdateProfileInfo,
  validateUpdateProfileAvatar,
  validateCreateCard,
  validateUpdateCard,
};
