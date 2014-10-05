var express = require('express')
var app = express();

app.set('views','./views')
app.set('view engine', 'jade')
app.set('port', (process.env.PORT || 5000))
app.use('/css',express.static(__dirname+ '/css'));
app.use('/js',express.static(__dirname+ '/js'));
app.use('/public',express.static(__dirname + '/public'));

app.get('/', function(request, response) {
      response.render('index');
})


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))

})


app.use(function(err, req, res, next){
      console.error(err.stack);
        res.status(500).send('Something broke!');
});
