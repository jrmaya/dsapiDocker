var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

var Template = require('./product');
var Palette = require('./palette');

var schema = mongoose.Schema;

var UserSchema = new schema(
    {
        name: {type: String, required: false},
        productionId: {type: String, required: false},
        lastname: {type: String, required: false},
        school: {type: String, required: false},
        email: {type: String, required: false, unique: true},
        password: {type: String, required: true},
        templates: [],
        role: {type: String, required: true},
        resetPasswordToken: {type: String, required: false},
        resetPasswordExp: {type: String, required: false}
    });

/*UserSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 9;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
}); */

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};
UserSchema.methods.resetPass = function (password) {
    return password;
}

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('User', UserSchema);
