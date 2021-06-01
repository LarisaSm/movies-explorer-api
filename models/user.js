// models/user.js
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: [true, 'Поле Имя обязательное'],
    minlength: [2, 'Минимальная длина имени — 2 символа'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длина имени — 30 символов'], // а максимальная — 30 символов
  },
  email: {
    type: String,
    required: [true, 'Поле емейл обязательное'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле пароль обязательное'],
    select: false, // необходимо добавить поле select
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user; // теперь user доступен
        })
        .catch(next);
    })
    .catch(next);
};

exports.User = mongoose.model('user', userSchema);
