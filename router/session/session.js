const express = require('express');
const app = express();
const {
    conexion,session_activa
} = require('../../mysql/mysql');



//=====================
// Listar session
//=====================

app.get('/session', [conexion,session_activa], (req, res) => {
    let query = "SELECT * FROM `session`";
    req.connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'no se puedo ejecutar el query',
                error
            });
        } // fin if
        else {
            if (result.length < 1) {
                return res.status(400).json({
                    ok: false,
                    message: 'No hay session creada'
                });
            } //fin if
            else {
                res.json({
                    ok: true,
                    result: result
                });
                req.connection.end();
                return;
            } // fin else
        } // fin else
    }); // fin connection
}); // fin get

//=====================
// Crear una session
//=====================
app.post('/session', [conexion,session_activa], (req, res) => {
    let body = req.body;
    let date = body.date.split("T");
   
    //Recoleccion de los datos 
    var data = {
        name: body.name,
        date: date[0],
        start_time: body.start_time,
        end_time: body.end_time,
        active: false
    }; // fin data

    //==========================
    // connection a la BD
    //==========================
    req.connection.query('INSERT INTO session SET ?', data, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: {
                    message: 'No se pudo ejecutar el query',
                    error
                }
            });
        } // fin if
        else {
            //======================
            // guardando la session
            //======================
            res.json({
                ok: true,
                message: 'Session Creada'
            });
            req.connection.end();
            return;
        } // fin else
    }); // fin connection

}); // fin post

//======================
// Actualizar un session
//======================

app.put('/session/:id', [conexion,session_activa], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    var data = {
        name: body.name,
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
        active: false
    }; // fin data
    let query = `UPDATE session SET ? WHERE id=${id}`;
    req.connection.query(query, data, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'No se puedo ejecutar el query',
                    error
                }
            });
        } // fin if
        else {
            res.json({
                ok: true,
                message: "Session Actualizada"
            });
            req.connection.end();
            return
        } //fin else
    }); // fin connection
}); // fin put 
module.exports = app;