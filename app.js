// app.js — входной файл
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { BASE_URL, NODE_ENV } = process.env;

const { PORT = 3000 } = process.env;

const indexRouter = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'mongodb://localhost:27017/filmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключаем мидлвары, роуты и всё остальное...

app.use(express.json());
app.use(cors());

app.use(requestLogger); // подключаем логгер запросов

app.use(indexRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  // это обработчик ошибки
  // если у ошибки нет статуса, выставляем 500
  // console.log(err);
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
