const express = require('express');
const conn = require('../db');

const router = express.Router();

router.get('/login', (req, res) => {
	res.render('students/login');
});
router.post('/login', (req, res) => {
	const data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		student_id: req.body.student_id,
	};

	conn.query(
		'SELECT * FROM students WHERE student_id = ' + data.student_id + ' AND first_name = ? AND last_name = ?',
		[data.first_name, data.last_name],
		(err, students) => {
			if (err) {
				console.log(err);
				return res.redirect('/students/login');
			}

			if (!students.length) {
				console.log('No students found');
				return res.redirect('/students/login');
			}

			req.session.user = {
				id: students[0].id,
				first_name: students[0].first_name,
				role: 'student',
			};

			res.redirect('/');
		}
	);
});

module.exports = router;
