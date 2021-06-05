const { Movie } = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

exports.getMovies = (req, res, next) => {
  // Movie.find({}).sort({ createdAt: -1 })
  Movie.find({}).sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Введены некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.moviesId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с таким id не существует');
      }
      if (movie.owner.toString() === req.user._id) {
        movie.remove()
          .then((movieDelete) => {
            if (!movieDelete) {
              throw new NotFoundError('Фильма с таким id не существует');
            }
            res.status(200).send(movieDelete);
          })
          .catch(next);
      } else throw new ForbiddenError('У вас нет прав удалять этот фильм');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Введены некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
