var express = require('express');
var app = express();
var router = express.Router();
var bodyParser  = require('body-parser'); //to json
 
 //import user model
var Palette        = require('../models/palette');

//Get DB connection
var db          = require('../../server');

//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());


// invoked for any requested passed to this router
router.use(function(req, res, next) {
    next();
});

// ==============================================================================================================
//API ROUTES

//GET ALL PALETTES
router.get('/', function(req, res) {
    Palette.find(function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });

})
//CREATE NEW PALETTE
.post('/', function(req, res){
        //Get user details
        var paletteName = req.body.paletteName;
        var paletteDescription = req.body.paletteDescription;
        
        //Do validation (to be refined)
        if (paletteName === undefined){
            res.json({message: "Sorry, your palette must have a name"});
        }else{
            //Create new user and save usr and check for err 
            var palette = new Palette;
            palette.values = [];
            for (var colorValue in req.body.values) {
                var color = req.body.values[colorValue];
                var colorObj = { value: color };
                palette.colors.push(colorObj);
            }
            palette.paletteName = paletteName;
            palette.paletteDescription = paletteDescription;

            palette.save().then(res.json({message: 'Palette created successfully! '}));
        }
    });

//UPDATE PALETTE

router.put('/:id', function(req, res) {

        Palette.findById(req.params.id, function(e, palette){
            palette.paletteName = req.body.paletteName;
            palette.paletteDescription = req.body.paletteDescription;
            palette.colors = [];

            for(var colors in req.body.values){
                var color = req.body.values[colors];
                var colorObj = { value: color };
                palette.colors.push(colorObj);
            }

            palette.save()
            .then(res.json({message: 'Palette updated successfully'}));
        });
})
        
   .delete('/:id', function (req, res) {  
        Palette.remove({
            _id: req.params.id
        }, function (err, palette) {
            if (err) return res.send(err);
            res.json({ message: 'Deleted' });
        });
    });

module.exports = router;
