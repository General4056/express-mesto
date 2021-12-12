const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(({ name, about, avatar, _id }) => {
      res.status(201).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.getUsers = (req, res) => {
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
      res.status(200).send(outputUsers);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.getUser = (req, res) => {
  console.log(req.params.id);

  User.findById(req.params.id)
    .then(({ name, about, avatar, _id }) => {
      res.status(200).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name == 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about, avatar }, { new: true, runValidators: true })
    .then(({ name, about, avatar, _id }) => {
      res.status(200).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then(({ name, about, avatar, _id }) => {
      res.status(200).send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      res.status(500).send({ message: `Произошла ошибка ошибка ${err.name}: ${err.message}` });
    });
};
