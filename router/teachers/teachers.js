const express = require('express');
const app = express();
const {
    conexion,
    session_activa
} = require('../../mysql/mysql');


//========================
// Listar teachers 
//========================
app.get('/teachers',[conexion,session_activa],(req,res)=>{
    
    

    req.connection.query('SELECT * FROM `user` WHERE grade="profesor"',(error,result)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                message:'No se puedo ejecutar el query',
                error
            });
        }// fin if
        if(result.length<1){
            return res.status(500).json({
                ok:false,
                message:`No hay registros`
            });
        }// fin if
        else{
            res.json({
                ok:true,
                result:result
            });
        }// fin else
    });// fin connection
});// fin get


//========================
// Listar teachers por id
//========================
app.get('/teachers/:id',[conexion,session_activa],(req,res)=>{
    
    var id = req.params.id;
    let query = `SELECT * FROM user WHERE doc_id=${id}`;

    req.connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                message:'No se puedo ejecutar el query',
                error
            });
        }// fin if
        if(result.length<1){
            return res.status(500).json({
                ok:false,
                message:`No hay registro asociado a esta id: ${id}`
            });
        }// fin if
        else{
            res.json({
                ok:true,
                result:result
            });
        }// fin else
    });// fin connection
});// fin get

//==================
// INSERT TEACHERS
//==================

app.post('/teachers',[conexion,session_activa],(req,res)=>{

    let body=req.body;
    var data={
        doc_id:body.doc_id,
        document_type: body.document_type,
        name: body.name,
        lastname: body.lastname,
        cellphone: body.cellphone,
        grade: body.grade,
        group: body.group,
        admin: false,
        active: true
    };

    req.connection.query('INSERT INTO user SET ?',data,(error,result)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                message:'No se pudo Guardar la informacion del teachers',
                error
            });
        }// fin if
        else{
            res.json({
                ok:true,
                message:'teachers registrado'
            });
        }// fin else
        req.connection.end();
    });// fin connection
});// fin post

//==================
// UPDATE TEACHERS
//==================

app.put('/teachers/:id',[conexion,session_activa],(req,res)=>{

    let id= req.params.id;
    let query= `UPDATE user SET ? WHERE doc_id=${id}`;
    let body=req.body;
    var data={
        doc_id:body.doc_id,
        document_type: body.document_type,
        name: body.name,
        lastname: body.lastname,
        cellphone: body.cellphone,
        grade: body.grade,
        group: body.group,
        admin: false,
        active: true
    };

    req.connection.query(query,data,(error,result)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                message:'No se actualizo la informacion',
                error
            });
        }// fin if
        else{
            res.json({
                ok:true,
                message:'Datos Actualizados'
            });
        }// fin else
        req.connection.end();
    });// fin connection

});// fin put

//==================
// DELETE TEACHERS
//==================

app.delete('/teachers/:id',[conexion,session_activa],(req,res)=>{

    let id= req.params.id;
    let query=`DELETE FROM user WHERE doc_id=${id}`;

    req.connection.query(query,(error,result)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                message:'No se puedo eliminar el registro con la id: '+id,
                error
            });
        }// fin if
        else{
            res.json({
                ok:true,
                message:'Registro eliminado'
            });
        }// fin else
    });// fin connection

});// fin delete

//==================
// exports the app
//==================
module.exports=app;