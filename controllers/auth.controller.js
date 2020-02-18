const jwt = require('jsonwebtoken');
const fs = require('fs');

function validateEmailAndPassword(){
    return true;
}
function findUserIdForEmail(email){
    return email;
}

exports.login = (req, res) => {
    const email = req.body.email,
          password = req.body.password;
    const privateKey = fs.readFileSync('./keys/private.key');

    if (validateEmailAndPassword()) {
       const userId = findUserIdForEmail(email);

        const jwtBearerToken = jwt.sign({}, privateKey, {
                algorithm: 'RS256',
                expiresIn: 120,
                subject: userId
            });

            res.status(200).json({
                idToken: jwtBearerToken, 
                expires: "",
            });                             
    }
    else {
        // send status 401 Unauthorized
        res.sendStatus(401); 
    }
}

exports.register = (req, res) => {}