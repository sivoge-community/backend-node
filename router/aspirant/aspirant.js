const express = require("express");
const fileUpload = require("express-fileupload");
const app = express("");
const {
    conexion,
    session_activa
} = require('../../mysql/mysql');
const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");
app.use(fileUpload({
    useTempFiles: true
}));
const date = require('date-and-time'); // libreria para trabajar con fechas


//===================
// OPEN IMG ASPIRANT 
//===================
app.get('/aspirant/avatar/:id',[conexion,session_activa],(req,res)=>{
    let id = req.params.id;
    req.connection.query(`SELECT aspirant.avatar, aspirant_type.charge_name FROM aspirant INNER JOIN aspirant_type ON aspirant_type.id=aspirant.aspirant_type WHERE aspirant.user_id=${id}`,(error,result)=>{
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } //fin if
        if (result.length < 1) {
            return res.status(400).json({
                ok: false,
                message: 'No hay datos en la tabla aspirant'
            });
        } // fin if
        else{
            let data= JSON.stringify(result);
            let json= JSON.parse(data);
          
                let charge_name = json[0].charge_name.split(" ");
                let pathavatar=path.resolve(__dirname,`../..//upload/avatar-aspirant/${charge_name[0]}/${json[0].avatar}`);
               res.sendFile(pathavatar);
          
           
        }
    });// fin connection
});// fin OPEN IMG ASPIRANT

//===============
//GET ASPIRANT
//===============

app.get('/aspirant', [conexion, session_activa], (req, res) => {

    req.connection.query(`SELECT aspirant.id,user.name,user.lastname,session.date,session.start_time,session.end_time,user.grade FROM aspirant INNER JOIN user ON user.doc_id=aspirant.user_id INNER JOIN session ON session.id=aspirant.session_id`, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } //fin if
        if (result.length < 1) {
            return res.status(400).json({
                ok: false,
                message: 'No hay datos en la tabla aspirant'
            });
        } // fin if
        else {
            let data1 = JSON.stringify(result);
            let json1 = JSON.parse(data1);
            let jsonVec = [];
            let vecaxi = [];
            for (let i = 0; i < json1.length; i++) {
                let info = {
                    id:json1[i].id,
                    name: json1[i].name,
                    lastname: json1[i].lastname,
                    grade: json1[i].grade,
                    date: json1[i].date,
                    strat_time: json1[i].start_time,
                    end_time: json1[i].end_time
                }
                vecaxi.push(info);
                jsonVec.push(vecaxi);
                vecaxi = new Array();
            } // fin for
            res.json({
                ok: true,
                resultado: jsonVec
            });
        } // fin else
    }); // fin connection

}); // fin GET

//====================
// GET ASPIRANT POR ID
//====================

app.get('/aspirant/:id', [conexion, session_activa], (req, res) => {

    let id = req.params.id;
    req.connection.query(`SELECT  aspirant.id,user.name,user.lastname,session.date,session.start_time,session.end_time,user.grade FROM aspirant INNER JOIN user ON user.doc_id=aspirant.user_id INNER JOIN session ON session.id=aspirant.session_id WHERE aspirant.id=${id}`, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } //fin if
        if (result.length < 1) {
            return res.status(400).json({
                ok: false,
                message: 'No hay datos en la tabla aspirant'
            });
        } // fin if
        else {
            let data1 = JSON.stringify(result);
            let json1 = JSON.parse(data1);
            let jsonVec = [];


            let info = {
                id:json1[0].id,
                name: json1[0].name,
                lastname: json1[0].lastname,
                grade: json1[0].grade,
                date: json1[0].date,
                strat_time: json1[0].start_time,
                end_time: json1[0].end_time
            }

            jsonVec.push(info);


            res.json({
                ok: true,
                resultado: jsonVec
            });
        } // fin else
    }); // fin connection

}); // fin GET

//===============
// POST ASPIRANT
//===============

app.post('/aspirant', [conexion, session_activa], (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se cargo el archivo'
        });
    }
    var body = req.body;

    let archivo = req.files.archivo;
    let nombrearchivo = archivo.name.split(".");
    let extencion = nombrearchivo[nombrearchivo.length - 1];
    let extencionesvalidas = ["jpg", "jepg", "png", "gif"];

    if (extencionesvalidas.indexOf(extencion) < 0) {
        delete_avatar(name_avatar);
        return res.status(400).json({
            ok: false,
            message: {
                info: "Extencion no valida: " + extencion,
                info2: "Solo se aceptan las extenciones: " + extencionesvalidas.join(", ")
            }
        });
    } // fin  if

    //==================================
    // mover archivo a la carpeta upload
    //==================================
    let data_mili = new Date();
    var name_avatar = body.user_id + - +data_mili.getMilliseconds();

    //================================
    // valido si el aspirante
    // no este ya registrado
    //================================
    req.connection.query(`SELECT * FROM aspirant WHERE user_id=${body.user_id}`, (error, result) => {
        if (error) {
            // delete_avatar(name_avatar, extencion);
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } // fin error
        if (result.length >= 1) {
            // delete_avatar(name_avatar, extencion);
            return res.status(400).json({
                ok: false,
                message: 'El aspirante ya se encuentra registrado'

            })
        } // fin if
        else {
            //===================================
            //validacion si elo aspirante existe
            //===================================
            req.connection.query(`SELECT * FROM user INNER JOIN aspirant_type ON user.grade=JSON_EXTRACT(aspirant_type.can_be_representative,"$.data_grade") WHERE user.doc_id=${body.user_id} AND aspirant_type.id=${body.aspirant_type}`, (error, result) => {
                if (error) {
                    // delete_avatar(name_avatar, extencion);
                    return res.status(500).json({
                        ok: false,
                        message: 'No se ejecuto el query',
                        error
                    });
                } // fin error
                if (result.length < 1) {
                    // delete_avatar(name_avatar, extencion);
                    return res.status(400).json({
                        ok: false,
                        message: 'El aspirante no puede aplicar a este cargo o el aspirate no existe en la base de datos rectifique los datos ingresados',

                    })
                } // fin if
                else {
                    let data1 = JSON.stringify(result);
                    let json1 = JSON.parse(data1);
                    var charge_name = json1[0].charge_name.split(" ");


                    archivo.mv(`upload/avatar-aspirant/${charge_name[0]}/${name_avatar}.${extencion}`, function (err) {
                        if (err) {
                            delete_avatar(name_avatar, extencion, charge_name[0]);
                            return res.status(500).json({
                                /// error del servidor
                                ok: false,
                                error: "No se pudo mover el archivo ala carpeta upload"
                            });
                        } // fin if

                        //==================================================================
                        // validacion si la session existe y que la fecha no se halla pasado
                        //==================================================================
                        req.connection.query(`SELECT * FROM session WHERE id=${body.session_id}`, (error, result) => {
                            if (error) {
                                delete_avatar(name_avatar, extencion, charge_name[0]);
                                return res.status(500).json({
                                    ok: false,
                                    message: 'No se ejecuto el query',
                                    error
                                });
                            } // fin error
                            if (result.length < 1) {
                                delete_avatar(name_avatar, extencion, charge_name[0]);
                                return res.status(400).json({
                                    ok: false,
                                    message: 'No existe session en la Base de Datos',
                                    error
                                })
                            } // fin if
                            else {
                                const now = new Date();
                                let date_fecha = date.format(now, 'YYYY-MM-DD'); // => '2015-01-02'
                                let hour = date.format(now, 'HH:mm:ss'); // => '23:14:05'
                                let data = JSON.stringify(result);
                                let json = JSON.parse(data);
                                for (let i = 0; i < json.length; i++) {
                                    let valor = json[i].date;
                                    let vectaxu = valor.split("T");

                                    if ((date_fecha < vectaxu[0]) || (vectaxu[0] === date_fecha && hour < json[i].start_time)) {
                                        //==================
                                        // ASPIRANT SAVE DB
                                        //==================
                                        let data = {
                                            session_id: parseInt(body.session_id),

                                            aspirant_type: parseInt(body.aspirant_type),
                                            avatar: name_avatar + '.' + extencion,
                                            user_id: body.user_id
                                        };
                                        req.connection.query('INSERT INTO `aspirant` SET ? ', data, (error, result) => {
                                            if (error) {
                                                delete_avatar(name_avatar, extencion, charge_name[0]);
                                                return res.status(500).json({
                                                    ok: false,
                                                    message: 'No se ejecuto el query',
                                                    error
                                                });
                                            } // fin error
                                            else {
                                                return res.json({
                                                    ok: true,
                                                    message: 'Aspirant Save!!!'
                                                });
                                            } // fin else

                                        }); // fin connection
                                    } //fin if
                                    else {
                                        delete_avatar(name_avatar, extencion, charge_name[0]);
                                        return res.status(400).json({
                                            ok: false,
                                            message: 'La session a la cual aspira no esta disponible',

                                        })
                                    } // fin else
                                } // fin for                          

                            } // fin else


                        }); // fin connection
                    }) // fin mover avatar
                } // fin else

            }) // fin connection
        } //fin else
    }); //fin connection


}); //FIN POST

//======================
//DELETE AVATAR-ASPIRAT
//======================
function delete_avatar(name, extencion, charge_name) {

    let path_avatar = path.resolve(__dirname, `../../upload/avatar-aspirant/${charge_name}/${name}.${extencion}`);
    if (fs.existsSync(path_avatar)) {
        fs.unlinkSync(path_avatar);
    } //fin if

} // fin delete_avatar
//======================
//DELETE AVATAR-ASPIRAT
//======================
function delete_avatarBD(name, charge_name) {

    let path_avatar = path.resolve(__dirname, `../../upload/avatar-aspirant/${charge_name}/${name}`);
    if (fs.existsSync(path_avatar)) {
        fs.unlinkSync(path_avatar);
    } //fin if

} // fin delete_avatar

//===============
// PUT ASPIRANT
//===============

app.put('/aspirant/:id', [conexion, session_activa], (req, res) => {
    let id = req.params.id;
    var body = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se cargo el archivo'
        });
    }
    var body = req.body;

    let archivo = req.files.archivo;
    let nombrearchivo = archivo.name.split(".");
    let extencion = nombrearchivo[nombrearchivo.length - 1];
    let extencionesvalidas = ["jpg", "jepg", "png", "gif"];

    if (extencionesvalidas.indexOf(extencion) < 0) {
        delete_avatar(name_avatar);
        return res.status(400).json({
            ok: false,
            message: {
                info: "Extencion no valida: " + extencion,
                info2: "Solo se aceptan las extenciones: " + extencionesvalidas.join(", ")
            }
        });
    } // fin  if

    //==================================
    // mover archivo a la carpeta upload
    //==================================
    let data_mili = new Date();
    var name_avatar = body.user_id + - +data_mili.getMilliseconds();

    //================================
    // valido si el aspirante
    // no este ya registrado
    //================================
    req.connection.query(`SELECT * FROM aspirant INNER JOIN aspirant_type ON aspirant.aspirant_type = aspirant_type.id WHERE user_id=${body.user_id}`, (error, result) => {
        if (error) {
            delete_avatar(name_avatar, extencion);
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } // fin error
        if (result.length < 1) {
            delete_avatar(name_avatar, extencion);
            return res.status(400).json({
                ok: false,
                message: 'El aspirante no esta registrado en la base de datos'

            })
        } // fin if
        else {
            let data = JSON.stringify(result);

            let json = JSON.parse(data);
            var charge_name = json[0].charge_name.split(" ");
            var img = json[0].avatar;
            archivo.mv(`upload/avatar-aspirant/${charge_name[0]}/${name_avatar}.${extencion}`, function (err) {
                if (err) {
                    delete_avatar(name_avatar, extencion, charge_name);
                    return res.status(500).json({
                        /// error del servidor
                        ok: false,
                        error: "No se pudo mover el archivo ala carpeta upload"
                    });
                } // fin if

                //===================================
                //validacion si elo aspirante existe
                //===================================
                req.connection.query(`SELECT * FROM user INNER JOIN aspirant_type ON user.grade=JSON_EXTRACT(aspirant_type.can_be_representative,"$.data_grade") WHERE user.doc_id=${body.user_id} AND aspirant_type.id=${body.aspirant_type}`, (error, result) => {
                    if (error) {
                        delete_avatar(name_avatar, extencion, charge_name[0]);
                        return res.status(500).json({
                            ok: false,
                            message: 'No se ejecuto el query',
                            error
                        });
                    } // fin error
                    if (result.length < 1) {
                        delete_avatar(name_avatar, extencion, charge_name[0]);
                        return res.status(400).json({
                            ok: false,
                            message: 'El aspirante no puede aplicar a este cargo o el aspirate no existe en la base de datos rectifique los datos ingresados',

                        })
                    } // fin if
                    else {

                        //==================================================================
                        // validacion si la session existe y que la fecha no se halla pasado
                        //==================================================================
                        req.connection.query(`SELECT * FROM session WHERE id=${body.session_id}`, (error, result) => {
                            if (error) {
                                delete_avatar(name_avatar, extencion, charge_name[0]);
                                return res.status(500).json({
                                    ok: false,
                                    message: 'No se ejecuto el query',
                                    error
                                });
                            } // fin error
                            if (result.length < 1) {
                                delete_avatar(name_avatar, extencion, charge_name[0]);
                                return res.status(400).json({
                                    ok: false,
                                    message: 'No existe session en la Base de Datos',
                                    error
                                })
                            } // fin if
                            else {
                                const now = new Date();
                                let date_fecha = date.format(now, 'YYYY-MM-DD'); // => '2015-01-02'
                                let hour = date.format(now, 'HH:mm:ss'); // => '23:14:05'
                                let data = JSON.stringify(result);
                                let json = JSON.parse(data);
                                for (let i = 0; i < json.length; i++) {
                                    let valor = json[i].date;
                                    let vectaxu = valor.split("T");

                                    if ((date_fecha < vectaxu[0]) || (vectaxu[0] === date_fecha && hour < json[i].start_time)) {
                                        //==================
                                        // ASPIRANT UPDATE
                                        //==================

                                        let data = {
                                            session_id: parseInt(body.session_id),

                                            aspirant_type: parseInt(body.aspirant_type),
                                            avatar: name_avatar + '.' + extencion,
                                            user_id: body.user_id
                                        };
                                        let query = `UPDATE aspirant SET ? WHERE id=${id}`;
                                        req.connection.query(query, data, (error, result) => {
                                            if (error) {
                                                delete_avatar(name_avatar, extencion, charge_name[0]);
                                                return res.status(500).json({
                                                    ok: false,
                                                    message: 'No se ejecuto el query',
                                                    error
                                                });
                                            } // fin error
                                            else {
                                                delete_avatarBD(img, charge_name[0]);
                                                return res.json({
                                                    ok: true,
                                                    message: 'Update Aspirant!!!'
                                                });
                                            } // fin else

                                        }); // fin connection
                                    } //fin if
                                    else {
                                        delete_avatar(name_avatar, extencion, charge_name[0]);
                                        return res.status(400).json({
                                            ok: false,
                                            message: 'La session a la cual aspira no esta disponible',

                                        })
                                    } // fin else
                                } // fin for                          

                            } // fin else


                        }); // fin connection

                    } // fin else
                }) // fin connection
            }) // fin mover archivo
        } //fin else
    }); //fin connection


}); // FIN PUT

//=================
// DELETE ASPIRANT
//=================

app.delete('/aspirant/:id', [conexion, session_activa], (req, res) => {

    let id = req.params.id;
    req.connection.query(`DELETE FROM aspirant WHERE id=${id}`, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'No se ejecuto el query',
                error
            });
        } // fin error
        else {
            return res.json({
                ok: true,
                message: 'aspirant eliminado...'
            });
        } // fin else
    }); // fin connection
}); // fin delete

//====================
// the export app
//====================
module.exports = app;