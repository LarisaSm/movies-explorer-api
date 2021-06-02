// models/user.js
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  country: {
    type: String, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  director: {
    type: String, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  duration:
  {
    type: Number, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  year:
  {
    type: String, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  description:
  {
    type: String, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  image:
  {
    type: String, // гендер — это строка
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  trailer:
  {
    type: String, // гендер — это строка
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail:
  {
    type: String, // гендер — это строка
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true,
  },
  nameRU:
  {
    type: String, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  nameEN:
  {
    type: String, // имя — это строка
    required: [true, 'Поле обязательное'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
});

exports.Movie = mongoose.model('movie', userSchema);
