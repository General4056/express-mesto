const router = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

const { cardValidation, cardIdValidation } = require('../middlewares/validators');

router.post('/cards', cardValidation, createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
