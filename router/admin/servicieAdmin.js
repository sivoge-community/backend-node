const express = require("express");
const app = express("");
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const {
    conexion
} = require("../../mysql/mysql");

//=====================================
// Listar  Administrador
//=====================================
app.get('/admin', conexion, (req, res) => {
    //=====================================
    // Query de los datos que voy a mostrar
    //=====================================
    let query = "SELECT user.document_type,user.doc_id,user.name,user.lastname,user.cellphone,user.daytime,user.grade,user.group FROM `user` INNER JOIN `auth`  on user.doc_id = auth.user_id where user.admin=true";
    req.connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: "No se puedo ejecutar el query",
                    err
                }
            });
        } //fin if
        else {

            res.json({
                ok: true,
                resultado: result
            });
            req.connection.end();
            return;
        } //fin else
    }); // fin req.connection
}); // fin app get


//=====================================
// Crear Administrador
//=====================================
app.post("/admin", conexion, (req, res) => {

    let body = req.body;
    let identificacion = parseInt(body.doc);
    let identificacionescapado = req.connection.escape(identificacion);
    let celular = parseInt(body.cellphone);
    let celularescado = req.connection.escape(celular);
    let passwordBycript = bcrypt.hashSync(body.password, 10);

    //=======
    // query
    //=======
    var pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sivoge'
    });


    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } // fin if
        //=========================================================
        //Verificacion que solo existan dos usuarios administrados
        //=========================================================
        let query1 = "SELECT count(admin) AS admin  FROM `user` WHERE admin=true";

        connection.query(query1, (err, results) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Error al ejecutar el query',
                        err
                    }
                });
            } //fin if
            else {

                let data = JSON.stringify(results);
                let json = JSON.parse(data);
                let valor = json[0].admin;
                //==================================
                // Si hay mas de dos administradores
                //==================================
                if (valor > 1) {
                    return res.json({
                        ok: true,
                        resultado: 'Solo pueden a ver dos administradores no se puede guardar el dato'

                    });
                } // fin if   
                else {
                    //==================================
                    // Si hay 1 administrador o ningúno
                    //==================================

                    //==================================
                    //Verificacion que el usuario exista
                    //==================================
                    let query = `SELECT doc_id FROM user WHERE doc_id=${identificacionescapado}`;

                    connection.query(query, function (err, results, fields) {

                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        } // fin if

                        //==================================
                        //Si no existe se guarda en la BD
                        //==================================
                        if (results.length < 1) {

                            var post = {
                                doc_id: `${identificacionescapado}`,
                                document_type: `${body.tdoc.toUpperCase()}`,
                                name: `${body.name.toLowerCase()}`,
                                lastname: `${body.lastname.toLowerCase()}`,
                                cellphone: `${celularescado}`,
                                daytime: `${body.daytime.toLowerCase()}`,
                                grade: `${body.grade.toLowerCase()}`,
                                group: `${body.group.toLowerCase()}`,
                                admin: true
                            };
                            //==================================
                            //Ejecucion del segundo query 
                            //==================================
                            connection.query('INSERT INTO user SET ?', post, function (err, results, fields) {

                                if (err) {
                                    return res.status(500).json({
                                        ok: false,
                                        message: 'No se ejecuto el query para guardar el dato',
                                        err
                                    });
                                } // fin if
                                else {

                                    //==================================
                                    //Ejecucion del tercer  query 
                                    //==================================
                                    let credenciales = {
                                        user_id: `${identificacionescapado}`,
                                        password: `${passwordBycript}`
                                    }
                                    connection.query('INSERT INTO auth SET ?', credenciales, function (err, results, fields) {

                                        if (err) {
                                            return res.status(500).json({
                                                ok: false,
                                                message: 'No se ejecuto el query para guardar el dato',
                                                err
                                            });
                                        } // fin if
                                        else {
                                            return res.json({
                                                ok: true,
                                                message: "Datos guardados"
                                            });

                                        } // fin else
                                    }); // fin connecion tercer query
                                    connection.release(); // libero la peticion
                                } //fin else
                            }); //fin connection de la segunda query
                        } //fin if

                        //==================================
                        //Si  existe el usuario en la BD
                        //==================================
                        else {
                            //==========================================
                            //Verificacion que el usuario exista en auth
                            //==========================================
                            let query = `SELECT user_id FROM auth WHERE doc_id=${identificacionescapado}`;
                            connection.query(query, function (err, results, fields) {

                                if (err) {
                                    return res.status(500).json({
                                        ok: false,
                                        err
                                    });
                                } // fin if

                                //==============================
                                // Si no existe en la tabla auth
                                //==============================
                                if (results.length < 1) {
                                    //==================================
                                    //guardo en la tabla auth 
                                    //==================================
                                    let credenciales = {
                                        user_id: `${identificacionescapado}`,
                                        password: `${passwordBycript}`
                                    }
                                    connection.query('INSERT INTO auth SET ?', credenciales, function (err, results, fields) {

                                        if (err) {
                                            return res.status(500).json({
                                                ok: false,
                                                message: 'No se ejecuto el query para guardar el dato',
                                                err
                                            });
                                        } // fin if
                                        else {
                                            return res.json({
                                                ok: true,
                                                message: "Datos guardados"
                                            });

                                        } // fin else
                                    }); // fin connecion tabla auth query
                                } //fin if
                                //==============================
                                // Si existe en la tabla auth
                                //==============================
                                else {
                                    return res.json({
                                        ok: true,
                                        message: "El Registro ya existe en la tabla auth"
                                    });
                                } // fin esle
                            }); // fin connection de la verificacion en la tabla auth
                            connection.release(); // libero la peticion
                        } // fin else
                    }); // fin connection principal 
                } //fin else             
            } //fin else

        }); // fin connection verificacion del # admin    


    }); // fin connection pool


}); //fin post


//=============================
// Modificiar administrador
//=============================

app.put('/admin/:id', conexion, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let identificacion = parseInt(id);
    let identificacionescapado = req.connection.escape(identificacion);
    let celular = parseInt(body.cellphone);
    let celularescado = req.connection.escape(celular);
    
    //=================================
    // query para actualizar
    //=================================

    var post = {

        document_type: `${body.tdoc.toUpperCase()}`,
        name: `${body.name.toLowerCase()}`,
        lastname: `${body.lastname.toLowerCase()}`,
        cellphone: `${celularescado}`,
        daytime: `${body.daytime.toLowerCase()}`,
        grade: `${body.grade.toLowerCase()}`,
        group: `${body.group.toLowerCase()}`
        // doc_id: `${identificacionescapado}`
    };
    //=================================
    //connecion para modificar la BD
    //=================================
    req.connection.query(`UPDATE USER SET ? WHERE doc_id=${identificacionescapado}`, post, (error, result) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se pudo ejecutar el query",
                    error
                }
            });
        } //fin if
        else {
            res.json({
                ok: true,
                message: "Datos Actualizados"
            });
            req.connection.end();
        } //fin else
    }); // fin connection

}); // fin app.put

module.exports = app;