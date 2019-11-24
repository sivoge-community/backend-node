const express = require('express')
const app = express()

// body-parse se usa para recoger las peticiones x-www-from-urlencode
// que son solamente los parametros que se mandan a guardar 
// por ejemplo en un formulario para recoger esos datos 
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

//=========================
// LLamado del archivo que contiene las rutas 
//=========================
app.use(require('../router/rutas'));
var mysql = require('mysql');
const date = require('date-and-time'); // libreria para trabajar con fechas


//=========================
// Puerto de escucha
//=========================
app.listen(3000, () => {
  console.log("Escuchando peticiones en el puerto ", 3000);
 
  var pool  = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sivoge',
    charset: 'utf8'
  });
 setInterval(function () {
  
 
  pool.getConnection(function(err, connection) {
    if (err) {
          return {
            ok: false,
            err: "No se Pudo conectar a la base de datos ",
            err
          }
        }// fin if
        const now = new Date();
        let date_fecha = date.format(now, 'YYYY-MM-DD'); // => '2015-01-02'
        let hour = date.format(now, 'HH:mm:ss'); // => '23:14:05'
       
    // Use the connection
    connection.query('SELECT * FROM `session`', function (error, result, fields) {
     
      let data = JSON.stringify(result);

        let json = JSON.parse(data);

        for (let i = 0; i < json.length; i++) {
          let valor = json[i].date;
          let vectaxu = valor.split("T");
         
          if ((vectaxu[0] === date_fecha && hour === json[i].start_time && hour <=json[i].end_time) || (vectaxu[0] === date_fecha && hour>= json[i].start_time && hour <=json[i].end_time)) {
            connection.query(`UPDATE session SET active=${true}`,(error,result)=>{
              if (error) {
                return {
                  ok: false,
                  message: 'No se puedo ejecutar el query en la tabla session',
                  error
                };
              } // fin if
              
            }); // fin connection actualizar
          
          } // fin if

          if ((vectaxu[0] === date_fecha &&  hour ===json[i].end_time) || (vectaxu[0] === date_fecha && hour>=json[i].end_time)) {
            connection.query(`UPDATE session SET active=${false}`,(error,result)=>{
              if (error) {
                return {
                  ok: false,
                  message: 'No se puedo ejecutar el query en la tabla session',
                  error
                };
              } // fin if
              
            }); // fin connection actualizar
          }// fin if
        } // fin for

       
      
      
      connection.release(); // libero peticion
   
      // Handle error after the release.
      if (error)  return {
        ok: false,
        err: "Al liberar la conexion ",
        err
      };
   
    
    });// fin connection 
  }); // fin pool
   
  }, 10000); // fin setInterval

}); // fin listen