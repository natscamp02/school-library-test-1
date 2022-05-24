const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('home', {
		session: req.session,
	});
});

router.get('/login', (req, res) => {
	res.render('auth/choose-login');
});

module.exports = router;
