//  required node-modules / middleware
var express           = require("express");
var app               = express();
var path              = require('path');
var expressSanitizer  = require("express-sanitizer");
var bodyParser        = require("body-parser");
var cookieParser      = require("cookie-parser");
var expressSession    = require("express-session");
var expressValidator  = require("express-validator");
var favicon           = require("serve-favicon");
var helmet            = require("helmet");
var csrf              = require("csurf");
var morgan            = require("morgan");
var methodOverride    = require('method-override');
var mongoose          = require('mongoose');
var fs                = require('fs');
var FileStreamRotator= require('file-stream-rotator');

// routes
var indexRoutes    = require("./routes/index");
var apiRoutes      = require("./routes/api");

const logDirectory  = path.join(__dirname, 'logs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(helmet());    // protect from some well know http vulnerability by setting approriate header

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressValidator());
app.use(expressSanitizer()); //sanitize user's html encoding inputpr

// db - configuration
let dbUrl = process.env.MLAB_VD_URL || "mongodb://localhost/vd-test";
mongoose.connect(dbUrl);

// log - configuration
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);  // ensure log directory exists
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

app.use('/',       indexRoutes);
app.use('/object', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
