const express = require('express');
const app = express();

require('./controllers/authController')(app);

app.listen(5000, () =>{
    console.log('Server is running');
});