const express = require('express');
const app = express();
const {
    conexion,
    session_activa
} = require('../../mysql/mysql');


//===================
// GET ASPIRANT_TYPE
//===================

app.get('/aspirant_type', [conexion, session_activa], (req, res) => {

    req.connection.query('SELECT * FROM `aspirant_type`', (error, result) => {
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
                message: 'No hay registros en la tabla aspirant_type'
            });
        } // fin if
        else {
            res.json({
                ok: true,
                result: result
            });
        } // el else
        req.connection.end();
    }); //fin connection
}); // fin get

//==========================
// GET ASPIRANT_TYPE POR ID
//==========================

app.get('/aspirant_type/:id', [conexion, session_activa], (req, res) => {

    var id = req.params.id;
    let query = `SELECT * FROM aspirant_type WHERE id=${id}`;
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
                message: 'No hay registros asociado al id: ' + id
            });
        } // fin if
        else {
            res.json({
                ok: true,
                result: result
            });
        } // el else
        req.connection.end();
    }); //fin connection
}); // fin get


//====================
// POST ASPIRANT_TYPE
//====================

app.post('/aspirant_type', [conexion, session_activa], (req, res) => {

    var body = req.body;
    var charge_name = body.charge_name.toLowerCase();
    var grade = body.grade.toLowerCase();
    //===========================
    //aspirant_type grade tercero
    //===========================
    if (charge_name === "concejo" && grade === "tercero") {
        var can_be_representative = {
            data_grade: 'tercero'

        }
        var can_vote = {
            data_grade: [
                'primero',
                'segundo',
                'tercero'
            ]
        }
        data = {
            charge_name: charge_name + ' ' + 'grado' + ' ' + grade,
            can_be_representative: JSON.stringify(can_be_representative),
            can_vote: JSON.stringify(can_vote)
        }
        req.connection.query('INSERT INTO aspirant_type SET ?', data, (error, result) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    message: 'No se ejecuto el query',
                    error
                });
            } // fin if
            else {
                res.json({
                    ok: true,
                    message: 'Aspirant_type save...'
                });
            } // fin else
            req.connection.end();
        }); // fin connection

    } // fin if

    //===========================
    //aspirant_type grade el resto
    //===========================
    if (charge_name === "concejo" && (grade === "cuarto" || grade === "quinto" || grade === "sexto" || grade === "septimo" || grade === "octavo" || grade === "noveno" || grade === "decimo")) {
        var can_be_representative = {
            data_grade: grade
        }
        var can_vote = {
            data_grade: grade
        }

        data = {
            charge_name: charge_name + ' ' + 'grado' + ' ' + grade,
            can_be_representative: JSON.stringify(can_be_representative),
            can_vote: JSON.stringify(can_vote)
        }
        req.connection.query('INSERT INTO aspirant_type SET ?', data, (error, result) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    message: 'No se ejecuto el query',
                    error
                });
            } // fin if
            else {
                res.json({
                    ok: true,
                    message: 'Aspirant_type save...'
                });
            } // fin else
            req.connection.end();
        }); // fin connection

    } // fin if

    //=========================
    // aspirant_type personero once 
    //=========================

    if (charge_name === "concejo" && grade === "once") {
        return res.status(500).json({
            ok: false,
            message: 'EL grado: ' + grade + ' no puede porstularse al cargo de ' + charge_name
        });

    } // fin if

    //=========================
    // aspirant_type contralor validacion
    //=========================

    if (charge_name === "controlador" && grade != "decimo" && grade != "noveno") {
        return res.status(500).json({
            ok: false,
            message: 'EL grado: ' + grade + ' no puede porstularse al cargo de ' + charge_name
        });

    } // fin if


    //=========================
    // aspirant_type personero validacion
    //=========================

    if (charge_name === "personero" && grade != "once") {
        return res.status(500).json({
            ok: false,
            message: 'EL grado: ' + grade + ' no puede porstularse al cargo de ' + charge_name
        });

    } // fin if

    //=========================
    // aspirant_type contralor
    //=========================

    if (charge_name === "contralor" && (grade === "decimo" || grade === 'noveno') ){
        var can_be_representative = {
            data_grade: ['noveno', 'decimo']

        }
        var can_vote = {
            data_grade: [
                'noveno',
                'decimo'
            ]
        }
        data = {
            charge_name: charge_name + ' ' + 'grado' + ' ' + grade,
            can_be_representative: JSON.stringify(can_be_representative),
            can_vote: JSON.stringify(can_vote)
        }
        req.connection.query('INSERT INTO aspirant_type SET ?', data, (error, result) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    message: 'No se ejecuto el query',
                    error
                });
            } // fin if
            else {
                res.json({
                    ok: true,
                    message: 'Aspirant_type save...'
                });
            } // fin else
            req.connection.end();
        }); // fin connection

    } // fin if

    //=========================
    // aspirant_type personero
    //=========================

    if (charge_name === "personero" && grade === "once") {
        var can_be_representative = {
            data_grade: 'once'

        }
        var can_vote = {
            data_grade: [
                'primero',
                'segundo',
                'tercero',
                'cuarto',
                'quinto',
                'sexto',
                'septimo',
                'octavo',
                'noveno',
                'decimo',
                'once'
            ]
        }
        data = {
            charge_name: charge_name + ' ' + 'grado' + ' ' + grade,
            can_be_representative: JSON.stringify(can_be_representative),
            can_vote: JSON.stringify(can_vote)
        }
        req.connection.query('INSERT INTO aspirant_type SET ?', data, (error, result) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    message: 'No se ejecuto el query',
                    error
                });
            } // fin if
            else {
                res.json({
                    ok: true,
                    message: 'Aspirant_type save...'
                });
            } // fin else
            req.connection.end();
        }); // fin connection

    } // fin if


    //=========================
    // aspirant_type profesor
    //=========================

    if (charge_name === "profesor" && grade === "profesor") {
        var can_be_representative = {
            data_grade: 'profesor'

        }
        var can_vote = {
            data_grade: [
                'profesor'
            ]
        }
        data = {
            charge_name: charge_name + ' ' + 'grado' + ' ' + grade,
            can_be_representative: JSON.stringify(can_be_representative),
            can_vote: JSON.stringify(can_vote)
        }
        req.connection.query('INSERT INTO aspirant_type SET ?', data, (error, result) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    message: 'No se ejecuto el query',
                    error
                });
            } // fin if
            else {
                res.json({
                    ok: true,
                    message: 'Aspirant_type save...'
                });
            } // fin else
            req.connection.end();
        }); // fin connection

    } // fin if

    //=========================
    // aspirant_type profesor validacion
    //=========================

    if (charge_name === "profesor" && grade != "profesor") {
        return res.status(500).json({
            ok: false,
            message: 'EL grado: ' + grade + ' no puede porstularse al cargo de ' + charge_name
        });

    } // fin if


    //=========================
    // aspirant_type padre de familia
    //=========================

    if (charge_name === "padre de familia" && grade === "padre de familia") {
        var can_be_representative = {
            data_grade: 'padre de familia'

        }
        var can_vote = {
            data_grade: [
                'padre de familia'
            ]
        }
        data = {
            charge_name: charge_name + ' ' + 'grado' + ' ' + grade,
            can_be_representative: JSON.stringify(can_be_representative),
            can_vote: JSON.stringify(can_vote)
        }
        req.connection.query('INSERT INTO aspirant_type SET ?', data, (error, result) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    message: 'No se ejecuto el query',
                    error
                });
            } // fin if
            else {
                res.json({
                    ok: true,
                    message: 'Aspirant_type save...'
                });
            } // fin else
            req.connection.end();
        }); // fin connection

    } // fin if

    //=========================
    // aspirant_type padre de familia validacion
    //=========================

    if (charge_name === "padre de familia" && grade != "padre de familia") {
        return res.status(500).json({
            ok: false,
            message: 'EL grado: ' + grade + ' no puede porstularse al cargo de ' + charge_name
        });

    } // fin if
    //===================
    /// manejo del error
    //===================

    if (charge_name != 'concejo' && charge_name != 'contralor' && charge_name != 'personero' && charge_name != "profesor" && charge_name != "padre de familia") {
        return res.status(500).json({
            ok: false,
            message: 'La categoria ' + charge_name + ' no se encuentra registrada en la base de datos'
        });
    } // fin if
}); // fin post

//=====================
// DELETE ASPIRANT_TYPE
//=====================

app.delete('/aspirant_type/:id',[conexion,session_activa],(req,res)=>{
    var id=req.params.id;
    let query=`DELETE FROM aspirant_type WHERE id=${id}`;
    req.connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                message:'no se ejecuto el query',
                error
            })
        }// fin if
        
        else{
            res.json({
                ok:true,
                message:'Dato eliminado'
            });
        }
    });//fin connection
});//fin delete

//===============
// export the app
//===============
module.exports = app;