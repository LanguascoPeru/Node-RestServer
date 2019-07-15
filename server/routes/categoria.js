const express = require('express');
const _ = require('underscore');

const Categoria = require('../model/categoria.js');
 
const aut = require('../middleware/autentication.js');
const app = express();

app.get('/categoria', aut.verifica_token,function(req, res){   

    Categoria.find()
        .exec((err, categoria_bd) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            } else {
                res.json({
                    ok: true,
                    usuarios: categoria_bd
                })
            }
        })

});

app.get('/categoria/:id',aut.verifica_token, function(req, res){
    let id_cat= req.params.id;
    Categoria.findById(id_cat, (err, categoria_bd) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            });
        } else {
            res.json({
                ok: true,
                usuarios: categoria_bd
            })
        }
    });
});

app.post('/categoria',aut.verifica_token, function(req, res){

    let body = req.body;        
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: body.id_usuario
    })

    categoria.save((err, data) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        } else {
            res.json({
                ok: true,
                usuario: data
            })
        }
    });
});


app.put('/categoria/:id',aut.verifica_token, function(req, res){
    let id_cat = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id_cat, body, { new: true, runValidators: true }, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            });
        } else {
            res.json({
                ok: true,
                usuario: data
            });
        }
    });

});


app.delete('/categoria/:id',aut.verifica_token,function(req, res){

    let id=req.params.id;

    Categoria.findByIdAndDelete(id,(err, cat_delete)=>{
        if (err) {
            res.status(400).json({
                ok:false,
                mensaje:err
            });
        }else{
             if (!cat_delete) {
                 res.json({
                     ok:false,
                     err:{
                         message: 'Usuario no encontrado'
                     }
                 });
             }else{
                 res.json({
                     ok:true,
                     mensaje:cat_delete
                 });
             }
 
        }
     })

});

module.exports = app;
