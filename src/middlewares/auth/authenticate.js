const jwt = require('jsonwebtoken')
const authenticate = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).json({message: "Unauthorized"})
    }

    const token = req.headers.authorization.split(" ")[1]
    if(!token) {
        return res.status(401).json({message: "Unauthorized"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded) {
        return res.status(401).json({message: "Unauthorized"})
    }
    req.user = decoded
    console.log(req.user)
    next()
}
module.exports = authenticate