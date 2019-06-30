const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const inscritoSchema = new Schema ({
    usuario: {
        type: String,
        required:true
    },
    idCurso: {
        type: String,
        required: true
    }
})

const Inscrito = mongoose.model('Inscrito', inscritoSchema);

module.exports = Inscrito;