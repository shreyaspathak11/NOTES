require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger.js');
const errorHandler = require('./middleware/errorHandler.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js');
const connectDB = require('./config/dbConn.js');
const mongoose = require('mongoose');
const { logEvents } = require('./middleware/logger.js');
const PORT = process.env.PORT || 3000;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root.js'));

app.use('/users', require('./routes/userRoutes.js'));

app.use('/notes', require('./routes/noteRoutes.js'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {                                       // If the request accepts HTML
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {                               // If the request accepts JSON
        res.json({ message: 'Not found' });
    } else {                                                       // If the request accepts neither HTML nor JSON
        res.type('txt').send('404 Not found');
    }   
}); 

app.use(errorHandler);

mongoose.connection.once('open', () => {
console.log('MongoDB connection established successfully');
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
});

mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvents(`${err.message}\t${err.stack}`, 'errLog.log','mongoErrLog.log ');
});