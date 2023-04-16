const {sign ,verify} = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const createTokens = (user)=>{
      const accessToken = sign({username:user.username}, secretKey);

      return accessToken;
}

const validateToken =(req, res , next)=>{
      const accessToken = req.cookies["accessToken"];

      if(!accessToken){
            return res.status(400).json({error: "user not authenticated"})
      }

      try{
            const validToken = verify(accessToken, secretKey);

            if(validToken){
                  req.authenticated = true;
                  return next();
            }

      }catch(err){
            return res.status(400).json({error: err})
      }
}

module.exports = {createTokens, validateToken};