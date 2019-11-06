const express = require('express');
const app     = express();

//==========
//  Router
//==========
app.use(require('./upload/upload'));
app.use(require('./admin/servicieAdmin'));
app.use(require('./session/session'));
app.use(require('./jury/jury'));
app.use(require('./user/user'));
app.use(require('./teachers/teachers'));

module.exports= app;