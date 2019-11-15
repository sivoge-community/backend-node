const express = require('express');
const app = express();
const {
    conexion,
    session_activa
} = require('../../mysql/mysql');


//===================
// GET USER POR ID
//===================
app.get('/user/:id', [conexion, session_activa], (req, res) => {

    var id = req.params.id;
    let query = `SELECT * FROM user WHERE doc_id=${id}`;
    req.connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } // fin if
        if (result.length < 1) {
            return res.status(500).json({
                ok: false,
                message: 'No hay resultros en el table user'
            });
        } // fin if
        else {
            res.json({
                ok: true,
                result: result
            });
        } // fin else
        req.connection.end();
    }); // fin connection

}); // fin get


//===================
// GET USER 
//===================
app.get('/user', [conexion, session_activa], (req, res) => {

    req.connection.query('SELECT * FROM `user`', (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } // fin if
        if (result.length < 1) {
            return res.status(500).json({
                ok: false,
                message: 'No hay resultros en el table user'
            });
        } // fin if
        else {
            res.json({
                ok: true,
                result: result
            });
        } // fin else
        req.connection.end();
    }); // fin connection

}); // fin get
//=================
// Exports the app
//=================
module.exports = app;