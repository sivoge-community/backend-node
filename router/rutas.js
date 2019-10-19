const express = require('express');
const app     = express();

//=======
// Rutas
//=======
app.use(require('./upload/upload'));

module.exports= app;