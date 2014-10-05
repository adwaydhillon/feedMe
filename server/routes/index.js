var express = require('express');
var router = express.Router();
var http = require('http');
var url = "https://api.uber.com/",
version = "v1",
request = require("request");
var app = express.createServer();

var ordrin = require("ordrin-api");
var ordrin_api = new  ordrin.APIs('EhS2B1Vj6aScZOECbvUmCUNna1P1dNOs7fig00Q6_QY', ordrin.TEST);


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
    ordrin_api.create_account({
        email: req.body.email,
        pw: req.body.pwd,
        first_name: req.body.fn,
        last_name: req.body.ln
    }, function(err, data){
        ordrin_api.create_addr({
            email: req.body.email,
            current_password: req.body.pwd,
            nick: "addr_main",
            phone: req.body.phone_no,
            zip: req.body.zip,
            addr: req.body.addr,
            city: req.body.city,
            state: req.body.state
        }, function(err, data){
            ordrin_api.create_cc({
                email: req.body.email,
                nick: "card_main",
                card_number: req.body.card_no,
                card_cvc: req.body.cvc,
                card_expiry: req.body.expiry,
                bill_phone: req.body.phone_no,
                bill_zip: req.body.zip,
                bill_addr: req.body.addr,
                bill_city: req.body.city,
                bill_state: req.body.state,
                current_password: req.body.pwd
            }, function(err, data){
                res.json({
                    account_confirm: "1"
                });
            });
        });
    });
});
router.post('/del_list', function(req, res) {
    ordrin_api.delivery_list({
        datetime: "ASAP",
        addr: req.body.addr,
        city: req.body.city,
        zip: req.body.zip
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
        rand_index = data[rand_index].id;

    }, function(err,data){
        ordrin_api.restaraunt_details({
            rid: rand
        }, function(err,data){
            var price = 0;
            var dish_found = false;
            var cat = 0;
            var dish = 0;
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
                first_name: req.body.fn,
                last_name: req.body.ln,
                email: req.body.email,
                current_password: req.body.pwd,
                nick: "addr_main",
                card_nick: "card_main",
                delivery_date: "ASAP"
            }, function(err, data){
                res.json({
                    order_confirm: "1"
                });
            });
        });
    });
});

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));

app.get('/api/me', 
  passport.authenticate('bearer', { session: false }),
  getProducts: function(latitude, longitude, callback) {
    if (typeof latitude === 'undefined' || typeof latitude === 'function') {
      throw new Error("Latitude must be defined");
    }
    if (typeof longitude === 'undefined' || typeof longitude === 'function') {
      throw new Error("Longitude must be defined");
    }

    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    
    get(this.getServerToken(), url+this.version+"/products?latitude="+latitude+"&longitude="+longitude, callback);
  },

  getPriceEstimate: function (start_latitude, start_longitude, end_latitude, end_longitude, callback) {
    var u = url + this.version + "/estimates/price?";
    u += "start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    u += "&end_latitude="+end_latitude+"&end_longitude="+end_longitude;
    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    get(this.getServerToken(), u, callback);
  },

  getTimeEstimate: function (start_latitude, start_longitude, customer_uuid, product_id, callback) {
    if (typeof customer_uuid === 'function') {
      callback = customer_uuid;
    }
    if (typeof product_id === 'function') {
      callback = product_id;
    }
    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    var u = url+this.version+"/estimates/time?start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    if (typeof customer_uuid !== 'undefined' && typeof customer_uuid != 'function') {
      url += "&customer_uuid="+customer_uuid;
    }
    if (typeof product_id !== 'undefined' && typeof product_id != 'function') {
      url += "&product_id="+product_id;
    }
    get(this.getServerToken(), u, callback);
  },

  setServerToken: function(token) {
    this.token = token;
  },
  getServerToken: function() {
    return this.token;
  },
  setApiVersion: function(version) {
    this.version = version;
  }
}

//module.exports = Uber;

/**
 * @private
 * A function to help ease development. So as not to rewrite the same thing over and over again.
 */
function get(token, url, callback) {
  var opts = {
    url: url,
    headers: {
      "Authorization": "Token " + token
    }
  }
  request.get(opts, function(error, body, response) {
    if (error) {
      callback(error, null);
    } else {
      if (body.statusCode != 200) {
        callback(JSON.parse(response), null);
      } else {
        callback(null, JSON.parse(response));
      }
    }
});
module.exports = router;

}
