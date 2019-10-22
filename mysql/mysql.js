
//===================
// conexion a mysql
//===================
var mysql = require('mysql');

let conexion = (req,res,next)=>{
   
     var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'sivoge',
        charset : 'utf8'
      });// fin de crear conexion
    connection.connect( (err)=> {
        if (err) {
          return {
             ok:false,
             err:"No se Pudo conectar a la base de datos ", err
            }
         
        }       
        console.log('Base de Datos Online!');
    });
    req.connection = connection;
    next();
}// fin conexion


module.exports={
    conexion
   
}