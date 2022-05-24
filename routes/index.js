const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.redirect('/books');
});

router.get('/login', (req, res) => {
	res.render('auth/choose-login');
});

module.exports = router;
