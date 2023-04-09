const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.message}\t${err.stack}`, 'errLog.log');
    res.status(500).send('Something went wrong');
  
}       

module.exports = errorHandler;