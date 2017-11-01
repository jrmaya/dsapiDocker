var mongoose    = require('mongoose');
var schema      = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

//get categories for product
var Category    = require('./category');

//Review required fields!!!! 
var ProductTemplateSchema = new schema(
    {
        name: { type: String, required: false }, 
        description: { type: String, require: false },  
        dateCreated: { type: Date, default: Date.now },
        active: { type: Boolean }, 
        svg: { type: String, required: false },
        tags: [String],
        category_id: {type: String, ref: 'CategorySchema'},
        svgUrl: {type: String, require: false}, //Save image url
        sampleColumns: { type: Number, required: false}
    }
    
);

ProductTemplateSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ProductTemplateSchema', ProductTemplateSchema);