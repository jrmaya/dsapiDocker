//server.js

//BASE SETUP

//===========================================================================================================

var express     = require('express');
var app         = express(); 
var mongoose    = require('mongoose'); //db manager
var fs          = require('fs');
//var passport    = require('passport');
//var flash       = require('connect-flash');

var bodyParser  = require('body-parser'); //to json
var morgan      = require('morgan');
//var session     = require('express-session');


var key = fs.readFileSync('security/official.key');
var cert = fs.readFileSync( 'security/official.com.au.chained.crt' );

var options = {
    key: key,
    cert: cert,
  };

var config      = require('./config.js');

//Import required controllers
var userController      = require('./app/routes/userController');
var paletteController   = require ('./app/routes/paletteController');
var productController   = require ('./app/routes/productController');
var categoryController  = require ('./app/routes/categoryController');
var loginController     = require ('./app/routes/loginController');
var emailManager        = require ('./app/routes/emailManagerController');

//CORS
var cors = require('./cors');


//=========================================================================================================
//CONFIGURE DATABASE
    mongoose.Promise = global.Promise; //use default global Promise
    mongoose.connect(config.url, 
        function(err){ 
        if (err) {
        console.error(err);
    } else {
        console.log('Connected to Mlab');
    }  
     });  //Connect to mlab sandbox

//=========================================================================================================


//Use custom CORS in all req.
app.use(cors());
app.use(morgan('dev'));

//Configure app. to use bodyParser() if we need to send any json to the client
app.use(bodyParser.urlencoded({ 
    extended:true, 
    limit: '10mb'
}));
app.use(bodyParser.json({
    limit: '10mb'
}));

// Process enviroment variable for the JWT secret 
process.env.SECRET_KEY = "Official!15";



//Midelware to serve public folder with static files
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/files', express.static(__dirname + '/files'));


//==========================================================================================================
//API ROUTES
app.use('/categories', categoryController);
app.use('/palettes', paletteController); 
app.use('/users', userController);
app.use('/login', loginController);
app.use('/products', productController);
app.use('/email', emailManager);



//Start the server
//===========================================================================================================
var server_port = 8383;
var server_portHttp = 8382;
var server_ip_address = '0.0.0.0';

var https = require('https');
var http = require('http');

https.createServer(options, app).listen(server_port, server_ip_address, function(){
    console.log('Running https on port ' + server_port);
});
http.createServer(app).listen(server_portHttp, function() {
    console.log('Running http on port ' + server_portHttp);
});


//export DB to be available to the controllers
module.exports = mongoose;
