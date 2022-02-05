const express = require('express');
const { authControllers } = require('../controllers');
const { auth } = require('../middlewares');
const { schemaValidate } = require('../middlewares');
const { authValidator } = require('../validationSchemas');

const router = express.Router();

router.post('/signup', schemaValidate(authValidator.authRegister), authControllers.register);

router.post('/login', schemaValidate(authValidator.authLogin), authControllers.login);

router.get('/logout', auth, authControllers.logout);

router.get('/current', auth, authControllers.current);

module.exports = router;