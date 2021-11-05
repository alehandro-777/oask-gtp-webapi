const jwt = require('jsonwebtoken');
const Entity = require('../models/user')

module.exports.login = function (req, res) { 
    
    Entity.findOne({ "login": req.body.login, "password": req.body.password}).exec( (err, user)=> {

            if (err) return res.status(500).json({ message: err });

            if (user) {
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 7);   //expires in + ... days from now 
                                
                const payload = {
                    id: user._id,                  
                    exp: parseInt(expiry.getTime() / 1000), //alow exp in seconds !!!!!
                  };

                  const jwtBearerToken = jwt.sign(payload, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256'});
    
                return res.status(201).json({ user: user.name, jwt: jwtBearerToken });
            }
            else {
                //user not found Unauthorized Requesting a restricted URL with incorrect credentials
                return res.status(401).json({ message: "User not found"});
            }
        }
    );
};