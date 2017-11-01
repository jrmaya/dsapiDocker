var mongoose    = require('mongoose');
var schema      = mongoose.Schema;

var PalettetSchema = new schema(
    {
        paletteName: String,
        paletteDescription : String,
        colors: [
            {
                value: String
            }
        ]
    }

);

PalettetSchema.pre('save', function(next) {
  var palette = this;

   if (this.isModified('colors')){
         console.log('this is done pre saving' + this);        
   }
            next();

});

module.exports = mongoose.model('PalettetSchema', PalettetSchema);
