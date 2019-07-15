const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('887310093942-6cdepf7vc8rasolc432g6o4igenmkd0k.apps.googleusercontent.com');

/// objeto que contiene la informacion del model de la bd
const Usuario = require('../model/usuario.js')

const app = express();

app.post('/login', function(req, res) {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, data_usuario) => {
        if (err) {
            res.status(500).json({
                ok: false,
                message: err
            });
        } else {
            if (data_usuario === null) {
                res.json({
                    ok: false,
                    message: 'No se encontro informacion con el correo ingresado'
                })
            } else {

                // tenemos que consultar la constraseña
                // bcrypt.compareSync  = compara la contraseña que se envia con la que esta en la bd, antes de compar la 
                // contra que envia el usuario la encripta para luego recien compararla

                if (bcrypt.compareSync(body.password, data_usuario.password)) {
                    //----- pick sierve para definir aquellos campos que queremos devolver;
                    //let data_user_encontro = _.pick(data_usuario, ['nombre']);

                    /// funcion encargada de generar el codigo token  se compone de 3 campos ..
                    let token_Porservidor = jwt.sign({
                        usuario: data_usuario 
                    }, process.env.SEED, 
                    { expiresIn: process.env.CADUCIDAD_TOKEN});


                    res.json({
                        ok: true,
                        message: data_usuario,
                        token: token_Porservidor
                    })
                } else {
                    res.json({
                        ok: false,
                        message: 'contraseña equivocada'
                    })
                }
            }



        }
    })

})

 //---- function de verifficacion de google sign in
 let verify = async(token) => {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '887310093942-6cdepf7vc8rasolc432g6o4igenmkd0k.apps.googleusercontent.com', 
  });
  const payload = ticket.getPayload();
  return {
    nombre : payload.name,
    email : payload.email,
    img : payload.picture,
    google: true
  }
}


app.post('/google', async (req, res) =>{   
    //-- verifica si el token de Google es correcto 
    let googleuser = await verify(req.body.idtoken)
                           .catch((e)=>{
                             return res.status(403).json({
                                 ok:false,
                                 error:e
                             })
                           }); 

    ///--- verificamos en la bd si existe el usuario    
    Usuario.findOne({email : googleuser.email },(err, usuarioBD)=>{
        if (err) {
            res.status(500).json({
                ok: false,
                message: err
            })
        }else{
            ///----- existe en la base de datos
            if (usuarioBD) {    
                //-----es de tipo google maps   ,          
                if (usuarioBD.google === false) {
                    //--- por que se creo de forma normal
                    res.status(400).json({
                        ok: false,
                        mensaje: 'Debe de usar su autentificacion normal'
                    })                    
                }else{  ///solo renovar el tokken

                        let token_Porservidor = jwt.sign({
                            usuario: usuarioBD 
                        }, process.env.SEED, 
                        { expiresIn: process.env.CADUCIDAD_TOKEN});

                        res.json({
                            ok: true,
                            message: usuarioBD,
                            token: token_Porservidor,
                            googleSign:true
                        })
    
                }                
            }else{ //---No existe ----- agregando  nuevo usuario 

                let user = new Usuario({
                    nombre: googleuser.nombre,
                    email: googleuser.email,
                    password: ':)',
                    img: googleuser.picture,
                    google : true
                })
                user.save((err, usuarioBD)=>{
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            mensaje: err
                        })
                    } else {
                        //---- generamos un token
                        let token_Porservidor = jwt.sign({
                            usuario: usuarioBD 
                        }, process.env.SEED, 
                        { expiresIn: process.env.CADUCIDAD_TOKEN});
    
                        res.json({
                            ok: true,
                            message: usuarioBD,
                            token: token_Porservidor
                        })
                    }
                })                
            }
                
        }
    })

})

module.exports = app;
 