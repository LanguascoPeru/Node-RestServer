////---- Puerto --- ///////

process.env.PORT = process.env.PORT || 3000;

////---- Fin de Puerto --- ///////


////---- Entorno --- ///////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
////---- Fin de Entorno --- ///////


////---- Base de datos --- ///////
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://languascoPeru:x5hpDSapDMypbRtX@cluster0-ak01y.mongodb.net/cafe';
}


process.env.URL_BD = urlBD;

////---- Base de datos--- ///////