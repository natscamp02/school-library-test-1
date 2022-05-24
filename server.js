require('dotenv').config({ path: './config.env' });

const conn = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 8080;

conn.connect((err) => {
	if (err) console.error(err);
	else console.log('Connected to database...');
});
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}...`));
