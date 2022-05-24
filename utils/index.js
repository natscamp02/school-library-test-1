exports.protectRoute = (req, res, next) => {
	if (!req.session?.user) return res.redirect('/login');

	next();
};

exports.restrictTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.session.user.role)) return res.redirect('/login');

		next();
	};
