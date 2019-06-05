const mongoose = require('mongoose');
const  uniqueValidator  = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let obj_rolvalidator = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"]
    },
    password: {
        type: String,
        required: [true, "El password es necesario"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: obj_rolvalidator
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJson = function(){
    let usr = this;
    let usrObject = usr.toObject();
    /// eliminado el campo que no queremos mostrar al usuario una vez que se grabe succed, toda la entidad 
    delete usrObject.password;
    return usrObject;
}
    

/// pluggin que me sirve para validar el campo de correo unico
usuarioSchema.plugin(uniqueValidator,{ message:'El email debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);

  