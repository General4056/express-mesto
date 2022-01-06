const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/AuthorizedError');

const secretKey = 'some-secret-key';

const isAuthorized = (req, res, next) => {
  // const token = req.cookies.jwt;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizedError('Пользователь неавторизован');
  }
  const token = authorization.replace('Bearer ', '');
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
