const express = require("express");
const fileUpload = require("express-fileupload");
const app = express("");
const {
    conexion,session_activa
} = require('../../mysql/mysql');
const Papa = require("papaparse");
const fs = require("fs");

app.use(fileUpload({
    useTempFiles: true
}));

app.post("/upload", [conexion,session_activa],  (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: "No se pudo cargar el archivo"
        });
    } // fin if

    let archivo = req.files.archivo;
    let nombrearchivo = archivo.name.split(".");
    let extencion = nombrearchivo[nombrearchivo.length - 1];
    let extencionesvalidas = ["csv", "xls", "xlsx"];

    if (extencionesvalidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            message: {
                info: "Extencion no valida:" + extencion,
                info2: "Solo se aceptan las extenciones: " + extencionesvalidas.join(",")
            }
        });
    } // fin  if

    //==================================
    // mover archivo a la carpeta upload
    //==================================

    archivo.mv(`upload/${archivo.name}`, function (err) {
        if (err) {
            return res.status(500).json({
                /// error del servidor
                ok: false,
                error: "No se pudo mover el archivo ala carpeta upload"
            });
        } // fin if
        var file = `upload/${archivo.name}`;
        console.log(file);
        var cnn = req.connection;
        var myarray = [];
        var vectAux = [];

        //=======================================
        // lectura del archivo con la libreria fs
        //=======================================
        var content = fs.readFileSync(file, {
            encoding: "utf8"
        });

        //===================
        //PapaParse
        //===================
        Papa.parse(content, {
            encoding: "utf-8",
            header: true,
            dynamicTyping: true,
            fastMode: true,
            step: function (row) {
                let typeIdenn = row.data["TDOC"].toString();
                let typeIden = typeIdenn.split(":");
                let nombre = row.data["NOMBRE1"] + " " + row.data["NOMBRE2"];
                let apellido = row.data["APELLIDO1"] + " " + row.data["APELLIDO2"];
                let grupo = row.data["GRUPO"];
                vectAux.push(
                    row.data["DOC"].toString(),
                    typeIden[0],
                    nombre.toLowerCase(),
                    apellido.toLowerCase(),
                    row.data["JORNADA"].toString().toLowerCase(),
                    row.data["GRADO"].toLowerCase(),
                    grupo
                );
                myarray.push(vectAux);
                vectAux = new Array();
            }, // fin step
            complete: function (results, file) {
                console.log(results);
                for (let i = 0; i < myarray.length; i++) {
                    let grupo = myarray[i][6].toString();
                    if (grupo.length > 1 && grupo.length <= 3) {
                        let grupocortado = grupo.substr(1, 2);
                        if (grupocortado === "01") {
                            grupocompli = "a";
                        } else if (grupocortado === "02") {
                            grupocompli = "b";
                        } else if (grupocortado === "03") {
                            grupocompli = "c";
                        } else if (grupocortado === "04") {
                            grupocompli = "d";
                        } else if (grupocortado === "05") {
                            grupocompli = "e";
                        } else if (grupocortado === "06") {
                            grupocompli = "f";
                        }
                        myarray[i][6] = grupocompli;
                    } // fin if
                    else {
                        if (grupo.length > 3) {
                            let grupocortado = grupo.substr(2, 3);
                            if (grupocortado === "01") {
                                grupocompli = "a";
                            } else if (grupocortado === "02") {
                                grupocompli = "b";
                            } else if (grupocortado === "03") {
                                grupocompli = "c";
                            } else if (grupocortado === "04") {
                                grupocompli = "d";
                            } else if (grupocortado === "05") {
                                grupocompli = "e";
                            } else if (grupocortado === "06") {
                                grupocompli = "f";
                            }
                            myarray[i][6] = grupocompli;
                        } // fin if
                        else {
                            if ((grupo.length = 1)) {
                                let grupocompli;
                                if (grupo === "1") {
                                    grupocompli = "a";
                                } else if (grupo === "2") {
                                    grupocompli = "b";
                                } else if (grupo === "3") {
                                    grupocompli = "c";
                                } else if (grupo === "4") {
                                    grupocompli = "d";
                                } else if (grupo === "5") {
                                    grupocompli = "e";
                                } else if (grupo === "6") {
                                    grupocompli = "f";
                                }
                                myarray[i][6] = grupocompli;
                            } // fin if
                        } // fin else
                    } // fin else
                } // fin for
                if (myarray.length < 1) {
                    return res.status(500).json({
                        ok: false,
                        message: "No se pudo leer el archivo"
                    });
                } //fin if
                let query =
                    "INSERT INTO `user`(`doc_id`,`document_type`,`name`,`lastname`,`daytime`,`grade`,`group`) VALUES ?";
                req.connection.query(query, [myarray], (error, results, fields) => {
                    if (error) {
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: "No se pudo guardar la informacion en la base de datos",
                                error
                            }
                        });
                    } //fin if
                    else {
                        //=====================
                        //Eliminar Archivo
                        //=====================
                        fs.unlink(`upload/${archivo.name}`, err => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    err: {
                                        message1: "Se Lleno la base de datos",
                                        message: "No se pudo eliminar el archivo",
                                        error
                                    }
                                });
                            }
                            console.log("Archivo eliminado");
                        });// fin eliminar archivo
                        //=================
                        //Close conexion DB
                        //=================
                        cnn.end();
                        //=====================
                        //Respuesta de que la bd esta cargada
                        //=====================
                        return res.json({
                            ok: true,
                            message: "Base de datos Cargada..."
                        });
                    } // fin else
                }); // fin ejecucion del query
            } // fin complete
        }); /// fin Papaparse
    }); // fin mover archivo
}); // fin peticion post

module.exports = app;