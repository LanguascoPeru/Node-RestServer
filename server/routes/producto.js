const express = require('express');

/// objeto que contiene la informacion del model de la bd
const Producto = require('../model/producto.js');
const aut = require('../middleware/autentication.js');
const app = express();
/*
app.get('producto', aut.verifica_token  ,(req, res)=>{


});

app.get('producto/:id', aut.verifica_token  ,(req, res)=>{


});
*/
app.post('producto/', [aut.verifica_token]  ,(req, res)=>{

    let body = req.body;
    var product = new Producto({
        nombre: body.nombre,
        precioUni:  body.precioUni ,
        descripcion:  body.descripcion,
        disponible:  body.disponible,
        categoria:  body.id_categoria,
        usuario:  body.id_usuario
    })

    product.save((err, data_producto)=>{
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        } else {
            res.json({
                ok: true,
                usuario: data_producto
            })
        }
    })

});
/*
app.put('producto/:id', aut.verifica_token  ,(req, res)=>{


});

app.delete('producto/:id', aut.verifica_token  ,(req, res)=>{


});
*/
module.exports = app;