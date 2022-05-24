const express = require('express');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.render('home');
});
router.post('/signup', (req, res) => {
	res.render('home');
});

router.get('/login', (req, res) => {
	res.render('home');
});
router.post('/login', (req, res) => {
	res.render('home');
});

router.get('/', (req, res) => {
	res.redirect('/auth/login');
});

module.exports = router;
