const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

/// objeto que contiene la informacion del model de la bd
const Usuario = require('../model/usuario.js')

const app = express();
///---find ,limit,exec  =   metodos del mongoose
app.get('/usuario', function(req, res) {

    ///req.query = parametros opcionales del get

    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    desde = Number(desde);
    hasta = Number(hasta)



    ///----count({}) las llaves es donde ira el filtro del select  ,, los campoos a mostrar 'nombre email role estado google img'
    Usuario.find({ estado: 'false' }, 'nombre email role estado google img')
        .skip(desde)
        .limit(hasta)
        .exec((err, data_user) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            } else {
                ///----count({}) las llaves es donde ira el filtro
                Usuario.count({ estado: 'false' }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios: data_user,
                        cantidad_reg: conteo
                    })
                })
            }
        })
})

app.post('/usuario', function(req, res) {
    let body = req.body;

    let user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, data) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        } else {
            data.password = null;
            res.json({
                ok: true,
                usuario: data
            })
        }
    });
})

app.put('/usuario/:id_usuario', function(req, res) {
    let cod_user = req.params.id_usuario;

    /// _pick = sirve para seleccionar solo aquellos campos que se desean actualizar....
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);

    //-----Escluyendo campos al actualizar...
    ////----delete body.email;


    ///-- findByIdAndUpdate {new:true}, para que devuelva las entidades actualizadas, {runValidators :true} sirve para que al actualizar respete validaciones del Grabar
    Usuario.findByIdAndUpdate(cod_user, body, { new: true, runValidators: true }, (err, data) => {
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




})

app.delete('/usuario/:id_user', function(req, res) {
    let id = req.params.id_user;
    /*
    Usuario.findByIdAndDelete(id,(err, user_delete)=>{
       if (err) {
           res.status(400).json({
               ok:false,
               mensaje:err
           });
       }else{
            if (!user_delete ) {
                res.json({
                    ok:false,
                    err:{
                        message: 'Usuario no encontrado'
                    }
                });
            }else{
                res.json({
                    ok:true,
                    mensaje:user_delete
                });
            }

       }
    })
    */


    let cambiandoEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiandoEstado, (err, usuario_actualizado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            })
        } else {
            let usuarioActualizado = _.pick(usuario_actualizado, ['nombre']);
            res.json({
                ok: true,
                usuario: usuarioActualizado
            })
        }
    })
})

//--- module.exports sirve para enviar funciones o variables a otro archivo
module.exports = app;