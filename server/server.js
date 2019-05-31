require('./config/config.js');
const express = require('express');

// impoortacion de mongoose
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// creando un midleware propio jalando datos de un archivo controlador
app.use(require('./routes/usuario.js'));


///--realizando la conexion a la base de datos mongodb
mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('base de datos online');
    }
});

app.listen(process.env.PORT, () => {
    console.log("escuchando en el puerto " + process.env.PORT);
})