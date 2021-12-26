const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const AuthorizedError = require('../errors/AuthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} невалидная ссылка!`,
    },
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} невалидная ссылка!`,
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizedError('Неправильные почта или пароль'),
        );
      }
      // user.password это хэш пароля в БД
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizedError('Неправильные почта или пароль'),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
