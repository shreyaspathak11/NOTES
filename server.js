const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root.js'));

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});