const express = require('express');
const validator = require('validator');

const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser, pageNotFound } = require('../controllers/users');

const userRouter = require('./users');
const movieRouter = require('./movies');

const indexRouter = express.Router();

indexRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный формат почты');
    }),
  }),
}), login);

indexRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный формат почты');
    }),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

indexRouter.use(userRouter);
indexRouter.use(movieRouter);
indexRouter.use('*', auth, pageNotFound);

module.exports = indexRouter;
