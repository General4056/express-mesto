const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { isAuthorized } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const {
  loginValidation,
  registrValidation,
} = require('./middlewares/validators');
const PageNotFound = require('./errors/PageNotFound');

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', registrValidation, createUser);

app.use(cookieParser());

app.use(isAuthorized);

app.use('/', cardRouter);

app.use('/', userRouter);

app.use((req, res, next) => {
  next(new PageNotFound('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
