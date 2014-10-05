var express = require('express')
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var loggedin = false;
var mongoose = require('mongoose/');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var duser = '-1';

var ordrin = require("ordrin-api");
var ordrin_api = new  ordrin.APIs('EhS2B1Vj6aScZOECbvUmCUNna1P1dNOs7fig00Q6_QY', ordrin.TEST);

mongoose.connect('mongodb://admin:admin@ds043170.mongolab.com:43170/calhacks-feedme');
    var Schema = mongoose.Schema;
    var UserDetail = new Schema({
        username: String,
        password: String,
        firstname: String,
        phone: String,
        zip: String,
        addr: String,
        city: String,
        zip: String,
        state: String,
        card_number: String,
        card_cvc: String,
        card_expiry: String,
        bill_phone: String,
        bill_city: String,
        bill_state: String,
        bill_zip: String,
        lastname: String
    }, {
        collection: 'userInfo'
    });
    var UserDetails = mongoose.model('userInfo', UserDetail);
    app.use(cookieParser());
      app.use(bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());

    app.set('views','./views')
    app.set('view engine', 'jade')
    app.set('port', (process.env.PORT || 5000))
    app.use('/css',express.static(__dirname+ '/css'));
    app.use('/js',express.static(__dirname+ '/js'));
    app.use('/public',express.static(__dirname + '/public'));
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.get('/order',function(req,res){res.render('order');});
    app.get('/uber',function(req,res){res.render('uber');});


    app.listen(app.get('port'), function() {
        console.log("Node app is running at localhost:" + app.get('port'))

    })

    passport.use(new LocalStrategy(function(username, password, done) {
        process.nextTick(function() {
            UserDetails.findOne({
                "username":username 
            }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false);
                }

                if (user.password != password) {
                    return done(null, false);
                }

                return done(null, user);
            });
        });
    }));


    app.get('/index', function(request, response) {
        response.render('index');
    })


    app.post('/index', passport.authenticate('local', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginFailure'
    }));


    app.get('/loginFailure', function(req, res, next) {
        res.send('Failed to authenticate');
    });

    app.get('/loginSuccess',  function(req, res, next) {
        //console.log("YO", req.user.username);
        res.render('index',{'user':req.user.username});
    });

app.get('/',function(req,res){app.redirect('index');});

app.post('/register', function(req, res) {
    ordrin_api.create_account({
        email: "jay@gmail.com",
        pw: "1",
        first_name: "jay",
        last_name: "cat"
    }, function(err, data){
        ordrin_api.create_addr({
            email: "jay@gmail.com",
            current_password: "k",
            nick: "addr_main",
            phone: "5712714000",
            zip: "15289",
            addr: "5000 forbes avenue",
            city: "pittsburgh",
            state: "PA"
        }, function(err, data){
            ordrin_api.create_cc({
                email: "jay@gmail.com",
                nick: "card_main",
                card_number: "4111111111111111",
                card_cvc: "123",
                card_expiry: "02/2016",
                bill_phone: "1111111111",
                bill_zip: "15289",
                bill_addr: "5000 forbes avenue",
                bill_city: "pittsburgh",
                bill_state: "PA",
                current_password: "pass"
            }, function(err, data){
                res.json({
                    account_confirm: "1"
                });
            });
        });
    });
});
 
app.get('/del_list', function(req, res) {
    ordrin_api.delivery_list({
        datetime: "ASAP",
        addr: "120 north avenue",
        city: "atlanta",
        zip: "30332"
    }, function(err,data){
        var rlist = [ ];
        if (err){
            console.error(err);
        }
        var max_amt = 25;
        for (var i = 0; i < data.length; i++) {
            if ( (data[i].is_delivering != 0) && (data[i].mino <= max_amt - 8)) {
                rlist.push(data[i].id);
            } // We have list of resteraunts delivering.
        }
        var rand_index = Math.random() * rlist.length;
        rand_index =data[rand_index].id;
 
    }, function(err,data){
        ordrin_api.restaraunt_details({
            rid: rand
        }, function(err,data){
            var price = 0;
            var dish_found = false;
            var cat = 0;
            var dish = 0;
            var resname = data.name;
            while(!dish_found){
                cat = Math.random() * data.menu.length;
                dish = Math.random() * (data.menu[cat].children.length);
                if ((data.menu[cat].children[dish].is_orderable == "1") && ((data.menu[cat].children[dish].price <= user_max - 8) && (menu[cat].children[dish].price >= 7 ))) {
                    dish_found = true;
                }
            } //dish index has been found
            var tray = menu[cat].children[dish].id + "/1";
        }, function (err,data){
            ordrin_api.order_user({
                rid: rid,
                tray: tray,
                tip: 0,
                first_name: "jay",
                last_name: "smith",
                email: "jay@gmail.com",
                current_password: "pass",
                nick: "addr_main",
                card_nick: "card_main",
                delivery_date: "ASAP"
            }, function(err, data){
                res.json({
                    order_confirm: "1"
                });
            });
        });

res.send('Ordered!',resname);
    });
});
 
 
//Uber part
app.get('/takemethere', function(req, res) {
    /*ordrin_api.delivery_list({
        datetime: "ASAP",
        addr: "5000 forbes avenue",
        city: "Pittsburgh",
        zip: "15289"
    }, function(err,data){
        var rlist = [ ];
        if (err){
            console.error(err);
        }
        for (var i = 0; i < data.length; i++) {
            if ( (data[i].is_delivering != 0) && (data[i].mino <= max_amt - 8)) {
                rlist.push(data[i].id);
            } // We have list of resteraunts delivering.
        }
        var rand_index = Math.random() * rlist.length;
        //rand_index = data[rand_index].id; //rest id
        //ordrin_api.restaurant_details({
        //    rid: rand_index
        //}, function(err,data) {
        //    lat = data.latitude;
        //    long = data.longitude;
        //    email= "jay@gmail.com";
        //    first_name = "jay";
        //    last_name = "smith";
        //    zip = "15289";
        //    phone = "1111111111";
            var uber_url = "https://m.uber.com/sign-up?client_id=RboV_QeRP_MMj2xXrfsK2zD5C91IFV1l&first_name="+first_name+"&last_name="+last_name+"&email="+email+"&country_code=us&mobile_phone="+phone+"&zipcode="+zip+"&product_id=b5e74e96-5d27-4caf-83e9-54c030cd6ac5&dropoff_latitude="+lat+"&dropoff_longitude="+long;
            window.open(uber_url);
        });
    });
*/
            var uber_url = "https://m.uber.com/sign-up?client_id=RboV_QeRP_MMj2xXrfsK2zD5C91IFV1l&first_name=Srijan&last_name=Sood&email=srijansood@gmail.com&country_code=us&mobile_phone=4049407775&zipcode=30332&product_id=b5e74e96-5d27-4caf-83e9-54c030cd6ac5&dropoff_latitude=37.867212&dropoff_longitude=--122.258328";
            res.redirect( uber_url);
res.send('Ordered!');
});
 


    app.use(function(err, req, res, next){
        console.error(err);
        res.status(500).send('Something broke!');
    });
