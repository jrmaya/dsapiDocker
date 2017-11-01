var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser'); //to json
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mg = require('nodemailer-mailgun-transport');


//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Mailgun config.
var smtpConfig = {
    auth: {
        api_key: 'key-9a963c022e0a6906af9e68d9eb3d5c2e',
        domain: 'sandboxbea5cb7df72d46088911759b469c0a3a.mailgun.org'
    }
}
var transporter = nodemailer.createTransport(mg(smtpConfig));


router.post('/', handleEmail);
router.post('/resetPassword', resetPasswordEmail);

function handleEmail(req, res) {
    var name = req.body.contactName;
    var email = req.body.email;
    var phone = req.body.phone;

    var svg = req.body.svg;

    var schoolName = req.body.details.school;
    var year = req.body.details.year;
    var comments = req.body.details.comments;

    var tableNames = req.body.details.names;

    var text = `This is a Design Studio email Acc\n\n
    Customer Name: `+ name + `
    Customer Phone: ` + phone + `
    Customer Email: ` + email + `
    School Name: ` + schoolName + `
    Year: `+ year + `
    Design comments:` + comments + `
    Names table` + tableNames;


    var mailOptions = {
        from: 'officialdesignstudio@gmail.com', // sender address
        to: 'it@official.com.au', // list of receivers
        subject: 'Design Studio', // Subject line
        text: text,
        attachments: [
            {
                filename: 'design.svg',
                content: svg,
                contentType: 'image/svg+xml'
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ message: 'error', err: error });
        } else {
            res.json({ message: 'success' });
        };
    });
}

function resetPasswordEmail(req, res) {
    var token = req.body.token;
    var email = req.body.email;
    var text = 'You are receiving this because '+ email +' have requested the reset of the password for your account.\n\n' +
        'Plese use the following token to reset your password:\n\n' + token + '\n\n' +
        'Go to the following linlk to reset your password:'
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    var mailOptions = {
        from: 'officialdesignstudio@gmail.com', // sender address
        to: 'it@official.com.au', // list of receivers
        subject: 'Design Studio Password Reset', // Subject line
        text: text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ message: 'error', err: error });
        } else {
            res.json({ message: 'success' });
        };
    });
}

module.exports = router;
