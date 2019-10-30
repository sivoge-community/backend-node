//===================
// conexion a mysql
//===================
var mysql = require('mysql');

let conexion = (req, res, next) => {

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sivoge',
    charset: 'utf8'
  }); // fin de crear conexion
  connection.connect((err) => {
    if (err) {
      return {
        ok: false,
        err: "No se Pudo conectar a la base de datos ",
        err
      }

    }
    console.log('Base de Datos Online!');
  });
  req.connection = connection;
  next();
} // fin conexion


let session_activa = (req, res, next) => {



  req.connection.query('SELECT * FROM `session`', (error, result) => {
    if (error) {
      res.status(500).json({
        ok: false,
        message: 'No se puedo ejecutar el query en la tabla session'
      });
    } // fin if
    else {

      let data = JSON.stringify(result);
      let json = JSON.parse(data);
      var cont = 0;
      for (let i = 0; i < json.length; i++) {
        if (json[i].active === true) {
          res.json({
            ok: true,
            message: 'Hay una session activa actualmente'
          });
        } //fin if
        else {
          cont++;
        }

      } // fi for
      if (cont === json.length) {
        req.session = json;
        next();
      }


    } // fin else
  }); // fin connection

}; // fin session

module.exports = {
  conexion,
  session_activa
}