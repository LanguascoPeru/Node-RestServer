////---- Puerto --- ///////

process.env.PORT = process.env.PORT || 3000;

////---- Fin de Puerto --- ///////


////---- Entorno --- ///////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
////---- Fin de Entorno --- ///////


////---- Vencimiento de token --- ///////
process.env.CADUCIDAD_TOKEN =60 * 60 * 24 * 30;
////---- Fin de Vencimiento de token --- ///////

////---- Autenticacion --- ///////
process.env.SEED = 'este-es-el-sed-desarrollo';

////---- Fin Autenticacion--- ///////


////---- Base de datos --- ///////
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://languascoPeru:x5hpDSapDMypbRtX@cluster0-ak01y.mongodb.net/cafe';
}


process.env.URL_BD = urlBD;

////---- Base de datos--- ///////

////---- Cliente ID google signin --- ///////
process.env.CLIENT_ID = '887310093942-6cdepf7vc8rasolc432g6o4igenmkd0k.apps.googleusercontent.com';