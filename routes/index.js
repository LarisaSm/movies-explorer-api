const express = require('express');

const userRouter = require('./users');
const movieRouter = require('./movies');
const { pageNotFound } = require('../controllers/users');

const indexRouter = express.Router();

indexRouter.use(userRouter);
indexRouter.use(movieRouter);
indexRouter.use('*', pageNotFound);

module.exports = indexRouter;
