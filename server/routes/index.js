var express = require('express');
var router = express.Router();

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
            nick: "main",
            phone: req.body.phone_no,
            zip: req.body.zip,
            addr: req.body.addr,
            city: req.body.city,
            state: req.body.state
        }, function(err, data){
            ordrin_api.create_cc({
                email: req.body.email,
                nick: "main",
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
                    confirm: "0"
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
        var rand_index = Math.random() * rlist.length
        rand_index = data[rand_index].id;

        ordrin_api.restaraunt_details()
    });
});

function pickRandomRestaurant(cb){

}

module.exports = router;
