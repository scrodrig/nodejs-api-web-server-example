const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

//custom middleware
app.use(logger);

//third party middleware
// Cross-Origin Resource Sharing (CORS)
const whitelist = [
    'https://yoursite.com',
    'https://www.google.com',
    'http://localhost:3500',
    'http://127.0.0.1:5500',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
//Built-in middleware for handing url encoded data
app.use(express.urlencoded({ extended: false }));

//Built-in middleware for json
app.use(express.json());

//Built-in middleware for serving static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));


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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
