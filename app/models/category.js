var mongoose    = require('mongoose');
var schema      = mongoose.Schema;

var CategorySchema = new schema(
    {
        _id: { type: String }, 
        description: String,
        parent: {
            type: String,
            ref: 'CategorySchema'
        },
        ancestors:[{
            type: String,
            ref: 'CategorySchema'
        }]
    }
);

module.exports = mongoose.model('CategorySchema', CategorySchema);