const jwt = require('jsonwebtoken');

////---- Verificar token --- ///////

////---- Verificar token --- ///////

//----obtener header en una peticion req.get('token)
let verifica_token = (req, res, next) => {
    let token = req.get('token')

    ///--- verificando que el token sea valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                mensaje: err
            });
        } else {
            ///req.usuario  = se el esta creando una variable llamadad usuario               ----------decoded.usuario contiene la informacion que se le dio en el Payload al momento de generar la clave token..
            req.usuario = decoded.usuario;
            next();
        }
    })
}

let verifica_Admin_Role = (req, res, next) => {
    let user = req.usuario;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(400).json({
            ok: false,
            mensaje: "No tiene permiso de Administrador"
        });
    }
}

///req.query = parametros opcionales del get
let verifica_token_img = (req, res, next) => {
    let token = req.query.token;
    ///--- verificando que el token sea valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                mensaje: err
            });
        } else {
            ///req.usuario  = se el esta creando una variable llamadad usuario               ----------decoded.usuario contiene la informacion que se le dio en el Payload al momento de generar la clave token..
            req.usuario = decoded.usuario;
            next();
        }
    })
}




module.exports = {
    verifica_token,
    verifica_Admin_Role,
    verifica_token_img
}