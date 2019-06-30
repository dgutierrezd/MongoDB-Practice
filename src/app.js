require('./Config/config')
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require('express-session')

const directoriopublico = path.join(__dirname, '../public');
app.use(express.static(directoriopublico));
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

app.use((req, res, next) => {
	// En caso de usar variables de sesión.
	if(req.session.user) {
		res.locals.sesion = true;
		res.locals.user = req.session.user
	}
	next()
})

app.use(bodyParser.urlencoded({extended: false}));

app.use(require('./Routes/index'))

var urlMongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/practica'

mongoose.connect(urlMongoDB, {useNewUrlParser: true}, (err, res) => {
	if(err)
		return console.log(err)	
	console.log('Connected')
})

app.listen(process.env.PORT, () => {
	console.log('Escuchando en el puerto ' + process.env.PORT)
})