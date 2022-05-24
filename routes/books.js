const express = require('express');
const conn = require('../db');
const { protectRoute, restrictTo } = require('../utils');

const router = express.Router();

// Get all books and their associated genres
router.get('/', (req, res) => {
	conn.query(
		'SELECT books.*, book_genres.genre FROM books, book_genres WHERE books.genre_id = book_genres.id',
		(err, books) => {
			if (err || books.length <= 0) {
				if (err) console.log(err);
				return res.render('books/list', { books: [] });
			}

			res.render('books/list', {
				books,
			});
		}
	);
});

// Create a book loan request
router.get('/request/:book_id', protectRoute, restrictTo('student'), (req, res) => {
	// Check if student has already requested the book
	conn.query(
		'SELECT * FROM requests WHERE student_id = ' + req.session.user.id + ' AND book_id = ' + req.params.book_id,
		(err, books) => {
			// Handle errors
			if (err) {
				console.log(err);
				return res.redirect('/books');
			}

			if (books.length) {
				console.log('Student already requested this book');
				return res.redirect('/books');
			}

			// Check if student has more than 2 outstanding books
			const today = new Date().toISOString().split('T')[0];
			conn.query(
				'SELECT * FROM requests WHERE student_id = ' +
					req.session.user.id +
					" AND return_date < '" +
					today +
					"'",
				(err, books) => {
					// Handle errors
					if (err) {
						console.log(err);
						return res.redirect('/books');
					}

					if (books.length > 2) {
						console.log('Student has outstanding books');
						return res.redirect('/books');
					}

					// Create the book request
					let sqlQuery = 'INSERT INTO requests (book_id, student_id, date_requested) VALUES ( ';
					sqlQuery += req.params.book_id + ', ';
					sqlQuery += req.session.user.id + ', ';
					sqlQuery += "'" + today + "' )";
					conn.query(sqlQuery, (err, result) => {
						if (err) {
							console.log(err);
							return res.redirect('/books');
						}

						res.render('requests/request-success');
					});
				}
			);
		}
	);
});

module.exports = router;
