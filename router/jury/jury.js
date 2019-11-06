const express = require("express");
const app = express("");
const {
    conexion,
    session_activa
} = require('../../mysql/mysql');

//================
// Listar jury
//================

app.get('/jury', [conexion, session_activa], (req, res) => {

    req.connection.query('SELECT * FROM `jury`', (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se puedo ejecutar el query',
                error
            });
        } // fin if

        if (result.length < 1) {
            return res.status(500).json({
                ok: false,
                message: 'La tabla jury no tiene datos'
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


//===============
// Crear jury
//===============

app.post('/jury', [conexion, session_activa], (req,res) => {

    let body = req.body;
    var data = {
        user_id: body.user_id,
        session_id: body.session_id,
        table_number: body.table_number
    };

    req.connection.query('INSERT INTO jury SET ?', data, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se puedo guardar la informacion en la table jury',
                error
            });
        } // fin if
        else {
            res.json({
                ok: true,
                message: 'Informacion guardada'
            });
        } // fin else
        req.connection.end();
    }); // fin connection
}); // fin post

//================
// UPDATE JURY
//================

app.put('/jury/:id', [conexion, session_activa], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let data = {
        user_id: body.user_id,
        session_id: body.session_id,
        table_number: body.table_number
    };
    let query = `UPDATE jury SET ? WHERE id=${id}`;
    req.connection.query(query, data, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se actualizo la informacion',
                error
            });
        } //fin if
        else {
            res.json({
                ok: true,
                message: 'Datos Actualizados'
            });
        } //fin else
        req.connection.end();
    }); // fin connection
}); // fin put

//=============
// DELETE JURY
//=============

app.delete('/jury/:id', [conexion, session_activa], (req, res) => {

    let id = req.params.id;
    let query = `DELETE  FROM jury WHERE id=${id}`;

    req.connection.query(query, (error, result) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se elimino el registro',
                error
            });
        } // fin if
        else {
            res.json({
                ok: true,
                message: 'Registro eliminado'
            });
        } // fin else
        req.connection.end();
    }) //fin connection

}); // fin delete


//=====================
// exportacion de app
//=====================
module.exports = app;