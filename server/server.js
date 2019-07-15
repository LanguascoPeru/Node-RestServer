require('./config/config.js');
const express = require('express');

// impoortacion de mongoose
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(express.static(path.resolve(__dirname , '../public')));

//---path.resolve() paquete propio de nodejs que sirve para obtener la ruta exacta de un archivo
console.log(path.resolve(__dirname , '../public'))


// creando un midleware propio jalando datos de un archivo controlador
///--- configuracion global de rutas
app.use(require('./routes/index.js'));


///--realizando la conexion a la base de datos mongodb ,         process.env.URL_BD = es una variable Global que contiene la conexion
mongoose.connect(process.env.URL_BD, {  useCreateIndex: true,useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log('base de datos online');
    }
});

app.listen(process.env.PORT, () => {
    console.log("escuchando en el puerto " + process.env.PORT);
})