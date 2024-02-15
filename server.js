require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

//Connect to the database
connectDB();

//custom middleware
app.use(logger);
//third party middleware
app.use(credentials);
// Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));
//Built-in middleware for handing url encoded data
app.use(express.urlencoded({ extended: false }));

//Built-in middleware for json
app.use(express.json());

//middleware for parsing cookies
app.use(cookieParser());

//Built-in middleware for serving static files
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logOut'));

app.use(verifyJWT); //it applies to all the routes below
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 - Not found' });
    } else {
        res.type('txt').send('404 - Not found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Mongoose connected to db successfully!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
