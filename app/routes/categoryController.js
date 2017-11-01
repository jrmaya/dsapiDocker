var express = require('express');
var app = express();
var router = express.Router();
var bodyParser  = require('body-parser'); //to json
 
 //import user model
var Category        = require('../models/category');

//Get DB connection
var db          = require('../../server');

//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());


// invoked for any requested passed to this router
router.use(function(req, res, next) {
    next();
});

/**
 * Application Routes
 * 
 */

//GET ALL CATEGORIES
router.get('/', function(req, res) {
    Category.find(function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });

})

//Get categories by ID
.get('/:id', function(req, res){
    Category.findById(req.params.id, function(e, doc){
        if(e)
        res.json({ message: 'Error' } + e)
            res.json(doc);
    })
})

//GET CATEGORIES WHERE PARENT IS 'SENIOR JERSEYS'
.get('/children/jerseys', function(req, res, next){
    Category.find({parent: "Senior Jerseys"}, function(err, doc){
        if (err)
            res.send(err)
        res.json(doc)
    })
})

//CREATE NEW CATEGORY
.post('/', function(req, res){
    var name = req.body.id;
    var description  = req.body.description;
    var parent = req.body.parent;
    // var ancestors = req.body.ancestors; //TO IMPLEMENT IF NEEDED

    //Create new category obj.
    var category = new Category;

    category._id = name;
    category.description = description;
    category.parent = parent;
    //implement ancestors if needed

    //Save to categories
    category.save().then(res.json({ message: 'Category created succesffully' }));
});

//UPDATE A CATEGORY
router.put('/:id', function (req, res){
    Category.findById(req.params.id, function(e, doc){
        try{
            doc.description = req.body.description;
            doc.parent = req.body.parent;
            //implement ancestors if needed
            doc.save().then(res.json({ message: 'You have succesfully updated the category' }))
        }
        catch(e){res.json({message: ' UPS '+ e })}
    })
})

//DELETE A CATEGORY
.delete('/:id', function(req, res){
    Category.remove({
        _id: req.params.id
    }, function(err, doc){
        if(err) return res.send(err);
        res.json({ message: 'Deleted' })
    });
});


module.exports = router;
