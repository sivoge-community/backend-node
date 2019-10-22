const express = require('express');
const app     = express();

//==========
//  Router
//==========
app.use(require('./upload/upload'));
app.use(require('./admin/servicieAdmin'));

module.exports= app;