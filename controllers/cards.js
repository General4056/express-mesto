const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then(({ name, link, owner, likes, createdAt, _id }) => {
      console.log(2)
      res.status(201).send({ name, link, owner, likes, createdAt, _id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      const outputCards = cards.map(
        ({ name, link, owner, likes, createdAt, _id }) => {
          const container = {
            name,
            link,
            owner,
            likes,
            createdAt,
            _id,
          };
          return container;
        },
      );
      res.status(200).send(outputCards);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('У вас нет прав на удаление данной карточки');
      }
      return Card.findByIdAndRemove(req.params.cardId).then((card) => {
        const { name, link, owner, likes, createdAt, _id } = card;
        return res
          .status(200)
          .send({ name, link, owner, likes, createdAt, _id });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан невалидный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      const { name, link, owner, likes, createdAt, _id } = card;
      return res.status(200).send({ name, link, owner, likes, createdAt, _id });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан невалидный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      const { name, link, owner, likes, createdAt, _id } = card;
      return res.status(200).send({
        name,
        link,
        owner,
        likes,
        createdAt,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан невалидный _id карточки'));
      } else {
        next(err);
      }
    });
};
