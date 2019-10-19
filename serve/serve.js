const express = require('express')
const app = express()

// body-parse se usa para recoger las peticiones x-www-from-urlencode
// que son solamente los parametros que se mandan a guardar 
// por ejemplo en un formulario para recoger esos datos 
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

    //=========================
    // LLamado del archivo que contiene las rutas 
    //=========================
app.use(require('../router/rutas'));


    //=========================
    // Puerto de escucha
    //=========================
app.listen(3000, () => {
    console.log("Escuchando peticiones en el puerto ", 3000);
})