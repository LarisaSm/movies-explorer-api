// router.js
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');

const userRouter = express.Router();

const {
  getUsersMe,
  updateUser,
} = require('../controllers/users');

userRouter.get('/users/me', auth, getUsersMe);

userRouter.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный формат email');
    }),
  }),
}), updateUser);

module.exports = userRouter;
