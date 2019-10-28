// Archivo principal del Backend, configuración del servidor
// y otras opciones

var express = require('express'); // Express: Framework HTTP para Node.js
var routes = require('./routes'); // Dónde tenemos la configuración de las rutas
var path = require('path');
var datos= require('./routes/datos');

var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');
var errorhandler = require('errorhandler');
var Request = require("request");



var async = require('express-async-await');
var fetch = require('node-fetch');

// Importamos el modelo usuario y la configuración de passport
require('./models/user');
require('./passport')(passport);




// Conexión a la base de datos de MongoDB que tenemos en local
mongoose.connect('mongodb://localhost:27017/passport-example', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

// Iniciamos la aplicación Express
var app = express();

// Configuración (Puerto de escucha, sistema de plantillas, directorio de vistas,...)
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('combined'))

// Middlewares de Express que nos permiten enrutar y poder
// realizar peticiones HTTP (GET, POST, PUT, DELETE)
app.use(cookieParser())
//app.use(express.urlencoded());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
//app.use(methodOverride('X-HTTP-Method-Override'))

// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(path.join(__dirname, 'public')));
// Indicamos que use sesiones, para almacenar el objeto usuario
// y que lo recuerde aunque abandonemos la página
app.use(session({ secret: 'lollllo' }));

// Configuración de Passport. Lo inicializamos
// y le indicamos que Passport maneje la Sesión
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);
app.get('/');

// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

/* Rutas de la aplicación */
// Cuando estemos en http://localhost:puerto/ (la raiz) se ejecuta el metodo index
// del modulo 'routes'
app.get('/', routes.index);  //cuando se ponga la pagina va a ir a la ruta el fichero index

//haciendo pruebas para que renderice index de una
//app.get('/',function(req,res) {
//  res.sendFile('index.html',{ root: '.' });
//});


/* Rutas de Passport */
// Ruta para desloguearse
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
// Ruta para autenticarse con Twitter (enlace de login)
app.get('/auth/twitter', passport.authenticate('twitter'));
// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook', passport.authenticate('facebook'));
// Ruta de callback, a la que redirigirá tras autenticarse con Twitter.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }
));
// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
));

//rutas datos

//let url = 'https://www.datos.gov.co/resource/9ghi-7xv6.json';


// Soporte para bodies codificados en jsonsupport.
var url 	= "https://www.datos.gov.co/resource/9ghi-7xv6.json"
app.use(bodyParser.json());
// Soporte para bodies codificados
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api/datos', function(req, res) {
	Request({
	    url: url,
	    json: false
	}, function (error, response, body) {
 
	    if (!error && response.statusCode === 200) {
	    	// Pintamos la respuesta JSON en navegador.
	        res.send(body) 
	    }
	})
});

//tambien funciona pero este aplica filtrado:
//https://luisjordan.net/node-js/web-services-con-node-js-express-creacion-de-api-rest/

//var url 	= "https://www.datos.gov.co/resource/9ghi-7xv6.json"
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.get('/api/datos/:nomarea', function(req, res) {
//  var itemNomarea = req.params.nomarea;
//	Request({
//	    url: url+itemNomarea,
//	    json: false
//	}, function (error, response, body) {
 
//	    if (!error && response.statusCode === 200) {
	    	// Pintamos la respuesta JSON en navegador.
//	        res.send(body) 
//	    }
//	})
//});
// Fin del que funciona con el parametro de busqueda que lo trae


// SI FUNCIONA! no tocar
//app.get('/api/datos', function(req, res) {
//  Request('https://www.datos.gov.co/resource/9ghi-7xv6.json', function(err, body){
//    res.json(body); //res is the response object, and it passes info back to client side
//});
//});
  
  
  //let traerJson = () => {
    //return fetch(url);
  //}

  //let mandarJson = async () => {
   // let eljson = await traerJson();
   // let respuesta = eljson.json();
    //console.log('RespuestaDatos: ' + respuesta);

  //}

  //return res.json(path.join(url+''));
  //---------------------------------------------------
  //mandarJson();
  //let jsondatos = await fetch(url);
  //console.log('exito '+ jsondatos.json());
  //res.send(jsondatos);
 //res.end();
  //res.send(jsondatos);
  //res.send('respond with a resource');
//}
//);

app.use(express.static(url,{extensions:['json']}));
app.use(function(req,res){
  res.status(404);
  res.json({
    error:{
      code: 404
    }
  })
})

// Inicio del servidor
app.listen(app.get('port'), function(){
  console.log('Aplicación Express escuchando en el puerto ' + app.get('port'));
  
});
