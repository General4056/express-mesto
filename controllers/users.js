const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ConflictError = require('../errors/ConflictError');
const AuthorizedError = require('../errors/AuthorizedError');

const secretKey = require('../middlewares/auth');

const saltRounds = 10;

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new ValidationError('Передан некоректный email');
  }
  return bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then(({ name, about, avatar, _id, email, password }) => {
        res.status(201).send({ name, about, avatar, _id, email, password });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
        if (err.name === 'MongoServerError' && err.code === 11000) {
          throw new ConflictError('Пользователь с данным email уже существует');
        } else {
          next(err);
        }
      })
      .catch(next);
  });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      const outputUsers = users.map(({ name, about, avatar, _id }) => {
        const container = {
          name,
          about,
          avatar,
          _id,
        };
        return container;
      });
      return res.status(200).send(outputUsers);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      const { name, about, avatar, _id } = user;
      return res.status(200).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Передан невалидный _id пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then(({ name, about, avatar, _id }) => {
      res.status(200).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then(({ name, about, avatar, _id }) => {
      res.status(200).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      const { name, about, avatar, _id, email } = user;
      return res.status(200).send({ name, about, avatar, _id, email });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Передан невалидный _id пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new ValidationError('Передан некоректный email');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => {
      throw new AuthorizedError(err.message);
    })
    .catch(next);
};
