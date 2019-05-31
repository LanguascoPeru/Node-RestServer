const express = require('express');
const app = express();
/// objeto que contiene la informacion del model de la bd
const Usuario = require('../model/usuario.js')


app.get('/usuario', function(req, res) {
    res.json('get usuario');
})

app.post('/usuario', function(req, res) {
    let body = req.body;
    let user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    })

    user.save((err, data) => {
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


})

app.put('/usuario/:id_usuario', function(req, res) {
    let cod_user = req.params.id_usuario;
    res.json('put usuario :' + cod_user);
})

app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
})

//--- module.exports sirve para enviar funciones o variables a otro archivo
module.exports = app;