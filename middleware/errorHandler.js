const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.log');
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

module.exports = errorHandler;
