const hbs = require('hbs');

hbs.registerHelper('respuestaAlertCoord', (respuestaCoord) => {
    if(!respuestaCoord) {
        return ''
    }
    else {
        return `<div class="alert alert-danger" role="alert">
                    ${respuestaCoord}
                </div>`
   }    
})

hbs.registerHelper('listarCursosCoordinador', listado => {

    let texto = '';
    listado.forEach(curso => {
        texto = texto + 
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${curso.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                    <p class="card-text">${curso.descripcion}</p>`
                    if(curso.estado == 'Disponible') {
                        texto = texto + `<a href="/cerrarCurso?id=${curso._id}">Cerrar Curso</a>`
                    } else 
                        texto = texto + `<a href="/abrirCurso?id=${curso._id}">Abrir Curso</a>`
                    texto = texto + `<a href="/estudiantesInscritos?id=${curso._id}" class="btn btn-secondary">Ver Inscritos</a>
                    </div>
                </div>
            </div>`
    });
    return texto;
})

hbs.registerHelper('estudiantesInscritos', (inscritos, idCurso, usuarios) => {
    let texto = '';
    inscritos.forEach(inscrito => {
        if(inscrito.idCurso === idCurso) {
            usuarios.forEach(user => {
                if(user.username == inscrito.usuario) {
                    texto = texto + 
                        `<div class="col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">${user.nombre} - ${user.username}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${user.documento}</h6>
                                <p class="card-text">E-mail: ${user.correo}</p>
                                <p class="card-text">Tel: ${user.telefono}</p>
                                <a href="/estudianteEliminado?user=${user.username}&id=${idCurso}" class="btn btn-danger">Eliminar estudiante</a>
                                </div>
                            </div>
                        </div>`
                }
            })
        }
    });
    return texto;
})

hbs.registerHelper('respuestaAlertAsp', (respuestaAsp) => {
    if(!respuestaAsp) {
        return ''
    }
    else {
        return `<div class="alert alert-danger" role="alert">
                    ${respuestaAsp}
                </div>`
   }    
})

hbs.registerHelper('respuestaAlertRegister', (respuestaRegister) => {
    if(!respuestaRegister) {
        return ''
    }
    else {
        return `<div class="alert alert-danger" role="alert">
                    ${respuestaRegister}
                </div>`
   }    
})

hbs.registerHelper('listarCursosAspirante', (inscritos, username, cursos) => {
    let texto = '';
    inscritos.forEach(inscrito => {
        if(inscrito.usuario == username) {
            cursos.forEach(curso => {
                if(curso._id == inscrito.idCurso) {
                    texto = texto + 
                        `<div class="col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">${curso.nombre}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                                <p class="card-text">${curso.descripcion}</p>
                                <a href="/eliminarCurso?id=${curso.id}" class="btn btn-danger">Eliminar de Mis Cursos</a>
                                </div>
                            </div>
                        </div>`
                }
            })
        } 
    });
    return texto;
})

hbs.registerHelper('listarUsuarios', listado => {
    let texto = '';
    listado.forEach(usuario => {
        texto = texto + 
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${usuario.nombre} - ${usuario.tipo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">N° de Documento: ${usuario.documento}</h6>
                    <p class="card-text">Correo electrónico: ${usuario.correo}</p>
                    <p class="card-text">Teléfono: ${usuario.telefono}</p>`
                    if(usuario.tipo == 'aspirante') 
                        texto = texto + `<a href="/rolDocente?user=${usuario.username}" class="btn btn-warning">Cambiar rol a Docente</a>`
                    else 
                        if(usuario.tipo == 'docente')
                            texto = texto + `<a href="/rolAspirante?user=${usuario.username}" class="btn btn-warning">Cambiar rol a Aspirante</a>`
                    texto = texto + `</div>
                </div>
            </div>`
    });
    return texto;
})

hbs.registerHelper('listarCursosInscribir', (cursos, inscritos, username) => {
    let texto = '';
        cursos.forEach(curso => {
            if(curso.estado == 'Disponible') {
                    texto = texto + 
                        `<div class="col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">${curso.nombre}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                                <p class="card-text">${curso.descripcion}</p>`
                                if(!inscritos.find(inscrito => inscrito.usuario == username && inscrito.idCurso == curso._id)) {
                                    texto += `<a href="/inscribir?id=${curso._id}" class="btn btn-primary">Inscribirse</a>`
                                } else 
                                    texto+= `<h6>Ya estas inscrito a este curso.</h6>`
                                
                                texto += `</div>
                            </div>
                        </div>`
            }
        });
    return texto;
})

hbs.registerHelper('listarCursosInteresado', listado => {
    let texto = '';
    listado.forEach(curso => {
        if(curso.estado == 'Disponible') {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${curso.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                        <p class="card-text">${curso.descripcion}</p>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})