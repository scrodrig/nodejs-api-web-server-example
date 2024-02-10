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
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
});

// Route handler
app.get(
    '/hello(.html)?',
    (req, res, next) => {
        console.log('attempting to access /hello');
        next();
    },
    (req, res) => {
        res.send('Hello, World!');
    },
);

const one = (req, res, next) => {
    console.log('one');
    next();
};
const two = (req, res, next) => {
    console.log('two');
    next();
};
const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
};

app.get('/chain(.html)?', [one, two, three]);

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
