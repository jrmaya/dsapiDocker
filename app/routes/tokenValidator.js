// Verify JWT token from a req 
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if (err) {
                return res.json({ success: false, message: err});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}
