const express = require('express');
const conn = require('../db');
const { protectRoute, restrictTo } = require('../utils');

const router = express.Router();

////////////////////////////////////////////////////////////////
// LIBRARIAM ONLY
////////////////////////////////////////////////////////////////
router.use(protectRoute, restrictTo('librarian'));

// Get all request information
router.get('/', (req, res) => {
	conn.query(
		'SELECT rqs.*, bks.id AS book_id, bks.title, bks.available, sts.first_name, sts.last_name FROM requests rqs, books bks, students sts WHERE rqs.book_id = bks.id AND rqs.student_id = sts.id',
		(err, requests) => {
			if (err || requests.length <= 0) {
				if (err) console.log(err);
				return res.render('requests/list', { requests: [] });
			}

			res.render('requests/list', { requests });
		}
	);
});

// Approve book request
router.get('/approve/:id', (req, res) => {
	const today = new Date().toISOString().split('T')[0];
	const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	conn.query(
		`UPDATE requests SET approved = 1, date_approved = '${today}', return_date = '${returnDate}' WHERE id = ` +
			req.params.id,
		(err, result) => {
			if (err) {
				console.log(err);
				return res.redirect('/requests');
			}

			conn.query('UPDATE books SET available = 0 WHERE id = ' + req.query.book, (err, result) => {
				if (err) console.log(err);

				res.redirect('/requests');
			});
		}
	);
});

// Remove book request after book is returned
router.get('/remove/:id', (req, res) => {
	conn.query('DELETE FROM requests WHERE id =' + req.params.id, (err, result) => {
		if (err) {
			console.log(err);
			return res.redirect('/requests');
		}

		conn.query('UPDATE books SET available = 1 WHERE id = ' + req.query.book, (err, result) => {
			if (err) console.log(err);

			res.redirect('/requests');
		});
	});
});

module.exports = router;
