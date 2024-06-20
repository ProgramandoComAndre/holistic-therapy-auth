

const authorize = (roles)=> {
    return (req, res, next) => {
        if(!roles.includes(req.user.roleid)) {
            return res.status(403).json({message: "Permission denied"})
        }
        next()
    }
}

module.exports = authorize