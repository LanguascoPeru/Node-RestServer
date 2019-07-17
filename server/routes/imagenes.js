const express = require('express');
const fs = require('fs');
const path = require('path');
const aut = require('../middleware/autentication.js');
const app = express();

app.get('/imagen/:tipo/:img', aut.verifica_token_img, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    //----imagen que el uusario manda a buscar -----
    let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        //----imagen por defecto en caso no halla ninguna imagen---
        let pathNoImage = path.resolve(__dirname, `../assets/no_found.jpg`);
        res.sendFile(pathNoImage);
    }

})


module.exports = app;