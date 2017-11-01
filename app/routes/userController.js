var express     = require('express');
var app         = express();
var router      = express.Router();
var bodyParser  = require('body-parser'); //to json
var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt');

//auth router
var auth        = express.Router();

//Get JsonWebToken
var jwt         = require('jsonwebtoken');

//import user model
var User        = require('../models/user');

//Get DB connection
var db          = require('../../server');

var tokenValidator = require('../routes/tokenValidator');


//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());



// ==============================================================================================================
//API ROUTES

//GET ALL USERS
router.get('/users', function(req, res, next) {
    User.find(function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });

});

// Get single user by ID
router.get('/:user_id', tokenValidator, (req, res)=>{
    User.findById(req.params.user_id, (e, user)=>{
        if(e)
            res.send(e);
            res.json(user);
    });
});

// Get user email by Id
router.get('/userEmail/:user_id', tokenValidator, (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if(err)
            res.send(err)
        var details =  {
            "name": user.name,
            "email":  user.email
        }
        res.send(details);
    })
})

// Get user templates
router.get('/userDesigns/:user_id', tokenValidator, (req, res) => {
    User.findById(req.params.user_id, (error, user) => {
        if(error) res.send(error);
        res.json(user.templates);
    });
});


//CREATE NEW USER
router.post('/register-school', function(req, res, next){
        //Get user details
        var name            = req.body.name;
        var lastname        = req.body.lastname;
        var school          = req.body.school; 
        var email           = req.body.email;
        var password        = req.body.password;
        var role            = req.body.role;

        if(role.toLowerCase() !== "school") {
            res.status(400).json({
                message: "Expecting role as school"
            });
        } else {
            //Do validation
            if (!name){
                res.json({message: "Sorry, the post cannot be done with empy values"});
            } else{
                //Create new user and save usr and check for err
                var user            = new User();
                user.name           = name;
                user.lastname       = lastname;
                user.school         = school;
                user.email          = email;
                user.role           = role;
                user.password       = user.generateHash(password);

                user.save(function(err) {
                    if(err === null) {
                        res.json({message: "User was successfully created"});
                    } else {
                        res.status(500).json(err.errors);
                    }
                });
            }
        }

    });

// CREATE ADMIN ACCOUNT !!!!
router.post('/new-admin', function(req, res, next){
        //Get user details
        var name            = req.body.name;
        var lastname        = req.body.lastname;
        var school          = req.body.school; 
        var email           = req.body.email;
        var password        = req.body.password;
        var role            = req.body.role;
            //Do validation
            if (!name){
                res.json({message: "Sorry, the post cannot be done with empy values"});
            } else{
                //Create new user and save usr and check for err
                var user            = new User();
                user.name           = name;
                user.lastname       = lastname;
                user.school         = school;
                user.email          = email;
                user.role           = role;
                user.password       = user.generateHash(password);

                user.save(function(err) {
                    if(err === null) {
                        res.json({message: "User was successfully created"});
                    } else {
                        res.status(500).json(err.errors);
                    }
                });
            }

    });

router.post('/check-email', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user){
        if (err) {return err}
        else{
            if(user.email == null){
                res.send({message: "available"});
            }else{
                res.send({'message': "taken"});
            }
        }
    });
});

// Update user
router.put('/:user_id', (req, res) => {
        User.findById(req.params.user_id, (error, user) => {
        if(error) res.send(error);

            user.name = user.name;
            user.lastname = user.lastname;
            user.school = user.school;
            user.email = user.email;
            // user.password = 'margarito';
            // user.templates = ['quterdrp'];

            user.save().then(res.json({message: 'User updated successfully! '+ user}));
    });
});



/**
 * 
 * CHANGE USER PASSWORD
 * 
 */

// Generate temp token to reset pssword & send email

// Router to assign a temp. token to the user to reset password
router.post('/forgot', (req, res) => {
    try {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) { res.message(err) }
            if (user !== null) {
                // Create token 
                var token = jwt.sign({
                    data: req.body.email
                }, process.env.SECRET_KEY, { expiresIn: '1h' });
                // Save token and exp in usr schema
                user.resetPasswordToken = token;
                user.resetPasswordExp = Date.now() + 3600000; // 1h.
                user.save().then(
                    res.json({
                        userId: user._id,
                        email: user.email,
                        token: token
                    })
                )
            } else {
                res.json({ message: 'User not found' });
            }
        });

    } catch (error) {
        res.json({error: error});
    }
});

// Return all the users that have a token to reset password
router.post('/resetPasswordUsers', (req, res) => {
    // Get users that want to reset pass.
    User.find({ 'resetPasswordToken': { $exists: true } }, function(err, user) {
        if(err) res.send(err);
        res.send(user);
    });
});

// Reset password
router.put('/reset/:token', tokenValidator, (req, res) => {
    var pass = req.body.password;
    User.findOne({ resetPasswordToken: req.params.token }, (error, user) => {
        var tokenExpire = user.resetPasswordExpires;
        if (Date.now() > tokenExpire) {
            res.json({ message: 'Password reset token is invalid or has expired.' })
        }
        else {
            user.password = user.generateHash(pass);
            user.resetPasswordToken = undefined;
            user.resetPasswordExp = undefined;
            user.save().then(res.json({ message: 'User updated successfully! ' + user }));
        }

    });
});

/**
 * 
 * Manage user templates
 * 
 */

// Add templates
router.put('/templates/:user_id', tokenValidator, (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, {$push: {"templates": req.body.svg}}, {}, function(error, template){
        if(error) res.send(error);
        res.send({'message': 'Template added successfully'})
    })
});

// Delete template
router.put('/deleteTemplate/:user_id',tokenValidator, (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, {$pull: {"templates": req.body.svg}}, {}, function(error, template){
        if(error) res.send(error);
        res.send({'message': 'Design removed successfully'})
    })
});

// Delete user
router.delete('/users/:user_id', function (req, res) {

    User.remove({
            "_id": req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'User successfully deleted' });
        });
});


module.exports = router;
