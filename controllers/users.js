const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { User } = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Данный емейл уже зарегистрирован');
      } else if (err.name === 'ValidationError') {
        throw new ValidationError('Введены некорректные данные');
      }
      next(err);
    })
    .catch((err) => next(err));
};

exports.updateUser = (req, res, next) => {
  // PATCH /users/me — обновляет профиль
  const { name, email } = req.body;
  if (name === undefined || email === undefined) {
    throw new ValidationError('Введены некорректные данные');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Введены некорректные данные');
      } else if (err.name === 'ValidationError') {
        throw new ValidationError('Введены некорректные данные');
      }
      next(err);
    })
    .catch((err) => next(err));
};

exports.pageNotFound = () => {
  throw new NotFoundError('Такой страницы не существует');
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      throw new UnauthorizedError('Ошибка авторизации');
    })
    .catch((err) => next(err));
};

exports.getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      } else if (err.name === 'CastError') {
        throw new ValidationError('Введены некорректные данные');
      }
      next(err);
    })
    .catch((err) => next(err));
};
