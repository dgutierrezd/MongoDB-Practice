const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const usuarioSchema = new Schema ({
    documento: {
        type: Number,
        required:true,
        default: 0
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: Number,
        required: true,
        default: 0
    },
    tipo: {
        type: String
    }
})

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario