const express = require('express');
const app = express();

require('../controllers/authentication.js')(app);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(3000, () => {
    console.log('Server is running');
});