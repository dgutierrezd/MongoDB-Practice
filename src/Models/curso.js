const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cursoSchema = new Schema ({
    nombre: {
        type: String,
        required:true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    valor: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        required: true
    }
})

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso