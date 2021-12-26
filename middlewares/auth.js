const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/AuthorizedError');

const secretKey = 'some-secret-key';

const isAuthorized = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new AuthorizedError('Пользователь неавторизован');
  }
  req.user = payload;
  return next();
};

module.exports = { isAuthorized, secretKey };
