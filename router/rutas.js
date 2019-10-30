const express = require('express');
const app     = express();

//==========
//  Router
//==========
app.use(require('./upload/upload'));
app.use(require('./admin/servicieAdmin'));
app.use(require('./session/session'));

module.exports= app;