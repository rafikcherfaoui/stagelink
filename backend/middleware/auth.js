const jwt = require('jsonwebtoken')

// this middleware checks if the user is logged in
const protect = (req, res, next) => {

  let token

  // check if the request has an Authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    
    try {
      // extract the token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1]

      // verify the token using our secret key from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // attach the decoded user info to the request so routes can use it
      req.user = decoded

      // move on to the next function (the actual route)
      next()

    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé — token manquant' })
  }
}

// this middleware checks if the logged in user has the required role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    // req.user.role was attached by the protect middleware above
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé — rôle requis : ${roles.join(' ou ')}` 
      })
    }

    next()
  }
}

module.exports = { protect, authorizeRoles }