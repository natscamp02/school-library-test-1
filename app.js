const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const { flash } = require('express-flash-message');

const mainRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const requestsRouter = require('./routes/requests');
const librariansRouter = require('./routes/librarians');
const studentsRouter = require('./routes/students');

const app = express();

// Setting up templating engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting up session
app.use(cookieParser());
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,

		resave: false,
		saveUninitialized: false,

		cookie: {
			maxAge: 1000 * 60 * 30,
		},
	})
);
app.use(flash());

// Routes
app.use('/books', booksRouter);
app.use('/requests', requestsRouter);
app.use('/librarians', librariansRouter);
app.use('/students', studentsRouter);
app.use('/', mainRouter);

// Error handling
app.all('*', (req, res, next) => {
	return next(new Error('Cannot find ' + req.originalUrl));
});
app.use((err, req, res, next) => {
	console.error(err.message);

	res.redirect('/');
});

module.exports = app;
