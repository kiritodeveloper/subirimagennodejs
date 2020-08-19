var express = require('express');
var app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');

var path = require('path');

var bodyParser = require('body-parser');

var port = 3000;

var urlImagen = '';

var routHome = require('./routes/index');


/*var formulario = "<form method='post' action='/subirfotito' enctype='multipart/form-data'>"+
				 "<fieldset>"+
				 	"<label>Subiremos una foto</label>"+
				 "</fieldset>"+
				 "<input type='file' name='imagen'>"+
				 "<fieldset>"+
				 "<input type='submit' value='subir fotito'>"+
				 "</fieldset>"
				+"</form>";*/

//solucionando fixess
app.use(bodyParser.json());

//nuestro views

app.set('views', path.join(__dirname + '/views'));

//nuestro engine
app.set('view engine', 'jade');

//nuestra carpeta public
app.use(express.static(path.join(__dirname + '/public')));


app.use(bodyParser.urlencoded({ extended: true}));

/*app.get('/', function(req, res){
	res.writeHead('200', {'Content-Type': 'text/html'});
	res.end(formulario);
});*/

app.use('/', routHome);

app.post('/subirfotito', multipartMiddleware, function(req, res){

	//obtenemos por get img
	console.log(req.files);

	fs.readFile(req.files.imagen.path, function(err, data){
		var nameImagen = req.files.imagen.name;
		console.log(data);
		if(err) {
			console.log('Sucedio un error: ' + err);
		}
		else {
			//console.log(data);
			console.log('nombre de mi imagen es: ' + nameImagen);
			var nuevoDirectory = __dirname + '/imagenes/' + nameImagen;
			fs.writeFile(nuevoDirectory, data, function(err){
				if(err) {
					console.log(err);
				}
				else {
					//res.redirect('imagenes/' + nameImagen);
					res.redirect('vistas-' + nameImagen);
					urlImagen = '/imagenes/' + nameImagen;
					console.log(urlImagen);
				}
			});
		}
		

	});
	
});

app.get('/imagenes/:nameimagen', function(req, res){
	res.writeHead('200', {
		'Content-Type': 'image/gif',
		'Content-Type': 'image/gif'
	});

	var imagen = fs.readFileSync(__dirname + '/imagenes/'+ req.params.nameimagen);

	//console.log(urlImagen);
	res.end(imagen, 'binary');
});

app.get('/vistas-:name', function(req, res){
	res.render('vista', {
		title: 'title',
		'imagen': urlImagen
	});
})


app.listen(port, function(){
	console.log('servidor encendido: ' + port);
});