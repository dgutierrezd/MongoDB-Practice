const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const Usuario = require('./../Models/usuario')
const Curso = require('./../Models/curso')
const Inscrito = require('./../Models/inscrito')
const dirViews = path.join(__dirname, '../../template/views')
const dirPartials = path.join(__dirname, '../../template/partials')
const bcrypt = require('bcryptjs');

require('./../Helpers/helpers')

app.set('view engine', 'hbs')
app.set ('views', dirViews)
hbs.registerPartials(dirPartials)

app.get('/',(req, res) => {

	res.render('index')
})

app.get('/register',(req, res) => {
    res.render('register')
})

app.post('/registrarUsuario', (req, res) => {
    let usuario = new Usuario ({
        documento: req.body.documento,
        nombre: req.body.nombre,
        username: req.body.usuario,
        password: bcrypt.hashSync(req.body.password, 8),
        correo: req.body.correo,
        telefono: req.body.telefono,
        tipo: req.body.tipo
    })

    usuario.save((err, ans) => {
        
        if(err) {
            if(err.name === 'ValidationError') {
                return res.render('register', {
                    respuestaRegister: 'El nombre de usuario que has ingresado ya existe.'
                })
            }
        }
        
        res.render('registrarUsuario', {
            message: 'El usuario ' + ans.username + ' se ha registrado exitosamente.'
        })
    })
})

app.post('/coordinador', (req, res) => {

    Usuario.findOne({username: req.body.username, tipo: 'coordinador'}, (err, ans) => {
        if(err)
            return console.log(err)
        if(!ans) {
            return res.render('index', {
                respuestaCoord: 'Usuario no encontrado'
            })
        }

        if(!bcrypt.compareSync(req.body.password, ans.password)) {
            return res.render('index', {
                respuestaCoord: 'La contraseña no es correcta.'
            })
        }

        // Para crear las variables de sesión
        req.session.user = ans._id
        req.session.name = ans.username

        res.render('coordinador', {
            sesion: true,
            user: req.session.username
        })

    })
})

app.get('/coordinador', (req, res) => {
    res.render('coordinador')
})

app.post('/aspirante', (req, res) => {
    Usuario.findOne({ $or: [{username: req.body.username, tipo: 'aspirante'}, {username: req.body.username, tipo: 'docente'}] }, (err, ans) => {
        if(err)
            return console.log(err)
        if(!ans) {
            return res.render('index', {
                respuestaAsp: 'Usuario no encontrado'
            })
        }

        if(!bcrypt.compareSync(req.body.password, ans.password)) {
            return res.render('index', {
                respuestaAsp: 'La contraseña no es correcta.'
            })
        }

        // Para crear las variables de sesión
        req.session.user = ans._id
        req.session.name = ans.username

        res.render('aspirante', {
            sesion: true,
            user: req.session.username
        })

    })
})

app.get('/aspirante', (req, res) => {
    res.render('aspirante')
})

app.get('/coordinador/cursos', (req, res) => {
    Curso.find({}).exec((err, ans) => {
        if(err)
            return console.log(err)
        
        res.render('cursosCoordinador', {
            listado: ans
        })
    })
})

app.get('/coordinador/crear', (req, res) => {
    res.render('crearCoordinador')
})

app.post('/creacionCurso',(req, res) => {
	let curso = new Curso ({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        estado: 'Disponible'
    })

    curso.save((err, ans) => {
        
        if(err) {
            console.log(err)
        }
        
        res.render('creacionCurso', {
            message: `El curso de ${ans.nombre} se ha creado exitosamente.`
        })
    })
})

app.get('/aspirante/cursos', (req, res) => {
    Inscrito.find({}).exec((err, ansInscritos) => {
        if(err)
            return console.log(err)
        Curso.find({}).exec((err, ansCursos) => {
            if(err)
                return console.log(err)
            res.render('verCursosAspirante', {
                cursos: ansCursos,
                inscritos: ansInscritos,
                username: req.session.name
            })
        })
    })
})

app.post('/aspirante/verCursos', (req, res) => {
    res.render('verCursosAspirante', {
        documento: req.body.documento
    })
})

app.get('/aspirante/inscribir', (req, res) => {
    Curso.find({}).exec((err, ansCursos) => {
        if(err)
            return console.log(err)
        Inscrito.find({}).exec((err, ansInscritos) => {
            if(err)
                return console.log(err)
            res.render('inscribirAspirante', {
                cursos: ansCursos,
                inscritos: ansInscritos,
                username: req.session.name
            })
        })
    })
})

app.get('/eliminarCurso', (req, res) => {

    Inscrito.findOneAndDelete({ $and: [{usuario: req.session.name}, {idCurso: req.query.id}]}, req.query, (err, ans) => {
        if(err)
            return console.log(err)
        
        res.render('cursoEliminado')
    })
})

app.post('/registrarInscripcion', (req, res) => {
    res.render('registrarInscripcion', {
        idCurso: req.body.idCurso,
        documento: req.body.documento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    })
})

app.get('/inscribir', (req,res) => {
    let inscrito = new Inscrito ({
        usuario: req.session.name,
        idCurso: req.query.id
    })

    inscrito.save((err, ans) => {
        
        if(err) {
            console.log(err)
        }
        Curso.findById(req.query.id, (err, ans) => {
            if(err)
                return console.log(err)
            res.render('inscribir', {
                message: `El usuario ${req.session.name} se ha inscrito al curso de ${ans.nombre}`
            })   
        })
    })
})

app.get('/estudiantesInscritos', (req, res) => {
    Inscrito.find({}).exec((err, ansInscritos) => {
        if(err)
            return console.log(err)
        Usuario.find({}).exec((err, ansUsuarios) => {
            if(err)
                return console.log(err)
            res.render('estudiantesInscritos', {
                inscritos: ansInscritos,
                usuarios: ansUsuarios,
                idCurso: req.query.id
            })
        })
    })
})

app.get('/cerrarCurso', (req, res) => {
    Curso.findOneAndUpdate({_id: req.query.id}, {$set:{estado:"Cerrado"}}, {new: true}, (err, ans) => {
        if(err)
            return console.log(err)
          
        res.render('cerrarCurso', {
            message: 'Curso cerrado.'
        })
    })
})

app.get('/abrirCurso', (req, res) => {
    Curso.findOneAndUpdate({_id: req.query.id}, {$set:{estado:"Disponible"}}, {new: true}, (err, ans) => {
        if(err)
            return console.log(err)
          
        res.render('cerrarCurso', {
            message: 'Curso disponible.'
        })
    })
})

app.get('/estudianteEliminado', (req, res) => {
    Inscrito.findOneAndDelete({ $and: [{usuario: req.query.user}, {idCurso: req.query.id}]}, req.query, (err, ans) => {
        if(err)
            return console.log(err)
        
        res.render('estudianteEliminado', {
            idCurso: req.query.id
        })
        console.log('Se eliminó el estudiante.')
    })
})

app.get('/coordinador/gestion', (req, res) => {
    Usuario.find({}).exec((err, ans) => {
        if(err)
            return console.log(err)
        
        res.render('gestionCoordinador', {
            listado: ans
        })
    })
})

app.get('/rolDocente', (req, res) => {
    Usuario.findOneAndUpdate({username: req.query.user}, {$set:{tipo:"docente"}}, {new: true}, (err, ans) => {
        if(err)
            return console.log(err)
          
        res.render('rolDocente', {
            message: `El usuario ${req.query.user} ya es docente.`
        })
    })
})

app.get('/rolAspirante', (req, res) => {
    Usuario.findOneAndUpdate({username: req.query.user}, {$set:{tipo:"aspirante"}}, {new: true}, (err, ans) => {
        if(err)
            return console.log(err)
          
        res.render('rolAspirante', {
            message: `El usuario ${req.query.user} ya es aspirante.`
        })
    })
})

app.get('/interesado', (req, res) => {
    res.render('interesado')
})

app.get('/interesado/cursos', (req, res) => {
    Curso.find({}).exec((err, ans) => {
        if(err)
            return console.log(err)
        
        res.render('cursosInteresado', {
            listado: ans
        })
    })
})

app.get('/salir', (req, res) => {
    req.session.destroy(err => {
        if(err)
            return console.log(err)
    })
    res.redirect('/')
})

app.get('*', (req, res) => {
	res.render('error')
})

module.exports = app