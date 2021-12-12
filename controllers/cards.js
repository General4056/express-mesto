const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then(({ name, link, owner, likes, createdAt, _id }) => {
      res.status(201).send({ name, link, owner, likes, createdAt, _id });
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      const outputCards = cards.map(({ name, link, owner, likes, createdAt, _id }) => {
        const container = {
          name,
          link,
          owner,
          likes,
          createdAt,
          _id,
        };
        return container;
      });
      res.status(200).send(outputCards);
    })
    .catch(() => res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(({ name, link, owner, likes, createdAt, _id }) => {
      res.status(200).send({ name, link, owner, likes, createdAt, _id });
    })
    .catch((err) => {
      if (err.name == 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then(({ name, link, owner, likes, createdAt, _id }) => {
      res.status(200).send({ name, link, owner, likes, createdAt, _id });
    })
    .catch((err) => {
      if (err.name == 'CastError') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      console.log(err.name);
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then(({ name, link, owner, likes, createdAt, _id }) => {
      res.status(200).send({ name, link, owner, likes, createdAt, _id });
    })
    .catch((err) => {
      if (err.name == 'CastError') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};
