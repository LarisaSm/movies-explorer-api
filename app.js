// app.js — входной файл
const express = require('express');
// require('dotenv').config();
// const cors = require('cors');
const validator = require('validator');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { BASE_URL, NODE_ENV } = process.env;

const { PORT = 3000 } = process.env;

const indexRouter = require('./routes/index');

const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'mongodb://localhost:27017/filmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// подключаем мидлвары, роуты и всё остальное...

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный формат почты');
    }),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный формат почты');
    }),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

// app.use(userRouter);
// app.use(movieRouter);

// app.use('*', pageNotFound);

app.use(indexRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  // это обработчик ошибки
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
