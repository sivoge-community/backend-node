const express = require("express");
const app = express("");
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const {
    conexion
} = require("../../mysql/mysql");


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
        //==================================
        //Verificacion que el usuario exista
        //==================================
        let query = `SELECT doc_id FROM user WHERE doc_id=${identificacionescapado}`;

        connection.query(query, function (err, results, fields) {

            if (err) {
                res.status(500).json({
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
                        res.status(500).json({
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
                                res.status(500).json({
                                    ok: false,
                                    message: 'No se ejecuto el query para guardar el dato',
                                    err
                                });
                            } // fin if
                            else {
                                res.json({
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
                //==================================
                //guardo en la tabla auth 
                //==================================
                let credenciales = {
                    user_id: `${identificacionescapado}`,
                    password: `${passwordBycript}`
                }
                connection.query('INSERT INTO auth SET ?', credenciales, function (err, results, fields) {

                    if (err) {
                        res.status(500).json({
                            ok: false,
                            message: 'No se ejecuto el query para guardar el dato',
                            err
                        });
                    } // fin if
                    else {
                        res.json({
                            ok: true,
                            message: "Datos guardados"
                        });
                     
                    } // fin else
                }); // fin connecion tabla auth query
                connection.release(); // libero la peticion
            } // fin else
        }); // fin connection principal 


    }); // fin connection pool


}); //fin post

module.exports = app;