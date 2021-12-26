const router = require('express').Router();
const { getUsers, getUser, updateUser, updateUserAvatar, getAuthorizedUser } = require('../controllers/users');
const { userIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares/validators');

router.get('/users', getUsers);
router.get('/users/me', getAuthorizedUser);
router.get('/users/:id', userIdValidation, getUser);
router.patch('/users/me', userInfoValidation, updateUser);
router.patch('/users/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
