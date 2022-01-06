const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .min(2)
      .max(256)
      .custom(validateURL, 'custom validation'),
  }),
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .min(2)
      .max(256)
      .custom(validateURL, 'custom validation'),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(4).email(),
    password: Joi.string().required().min(4),
  }),
});

module.exports.registrValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).custom(validateURL, 'custom validation'),
    email: Joi.string().required().min(4).email(),
    password: Joi.string().required().min(4),
  }),
});
