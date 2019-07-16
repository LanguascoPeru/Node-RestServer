const express = require('express');
const fileUpload = require('express-fileupload');
/// objeto que contiene la informacion del model de la bd
const Usuario = require('../model/usuario.js');
//--- file system
//-- path porque vamos a crear una ruta, existen en node
const fs = require('fs');
const path = require('path');

const app = express();

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado ningun archivo'
        });
    }

    let list_tiposValidos = ['usuarios', 'productos'];

    if (list_tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'los Tipos Validos son ' + list_tiposValidos.join(', ')
        });
    }


    // Si pasa si  problemas todo el archivo fisico recae en req.files.<nombre>;
    let archivos = req.files.archivo;

    let nombreCortado = archivos.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extensiones permitidas
    let list_extensiones_validas = ['png', 'jpg', 'gif', 'jpeg'];

    if (list_extensiones_validas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'las extensiones permitidas son ' + list_extensiones_validas.join(', ')
        });
    }
    // Utilice el método mv () para colocar el archivo en algún lugar de su servidor
    //---concatenando la ruta

    let nombreArchivo = `${id}_${new Date().getMilliseconds()}.${extension}`

    archivos.mv('upload/' + tipo + '/' + nombreArchivo, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }
        imagenUsuario(id, res, nombreArchivo);
    });

});

function imagenUsuario(id, res, nombreArchivo) {

    ///----consultando el registro por el id
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario no existe"
            });
        }

        let pathImagen = path.resolve(__dirname, `../../upload/usuarios/${usuarioBD.img}`);
        console.log('antes')
        console.log(pathImagen)
        if (fs.existsSync(pathImagen)) {
            console.log('entrooo')
            console.log(pathImagen)
            fs.unlinkSync(pathImagen);
        }

        //----modificando el valor 
        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }
            return res.json({
                ok: true,
                mensaje: usuarioSaved
            })
        });

    });
}

module.exports = app;