const express = require('express');
const bcrypt = require('bcrypt');
const conn = require('../db');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.render('librarians/signup');
});
router.post('/signup', async (req, res) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	};

	data.password = await bcrypt.hash(data.password, 12);

	conn.query(
		'INSERT INTO librarians (first_name, last_name, email, password) VALUES (?,?,?,?)',
		Object.values(data),
		(err, result) => {
			if (err) {
				console.log(err);
				return res.redirect('/librarians/signup');
			}

			req.session.user = {
				id: result.insertId,
				first_name: data.first_name,
				role: 'librarian',
			};

			res.redirect('/');
		}
	);
});

router.get('/login', (req, res) => {
	res.render('librarians/login');
});
router.post('/login', (req, res) => {
	const data = {
		email: req.body.email,
		password: req.body.password,
	};

	conn.query('SELECT * FROM librarians WHERE email = ?', [data.email], async (err, libs) => {
		if (err) {
			console.log(err);
			return res.redirect('/librarians/login');
		}

		if (!libs.length) {
			console.log('Incorrect email address');
			return res.redirect('/librarians/login');
		}

		if (!(await bcrypt.compare(data.password, libs[0].password))) {
			console.log('Incorrect password');
			return res.redirect('/librarians/login');
		}

		req.session.user = {
			id: libs[0].id,
			first_name: libs[0].first_name,
			role: 'librarian',
		};

		res.redirect('/');
	});
});

module.exports = router;
