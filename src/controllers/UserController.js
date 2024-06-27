const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMessage = require("../../sendMessage");
const Role = require("../models/Role");
require("dotenv").config();
exports.register = async (req, res) => {
    try {
    const { name, username, password, confirmPassword ,roleid, specialities } = req.body;
    if(!name) {
        return res.status(400).json({message: "Name is required"})
    }

    if(!username) {
        return res.status(400).json({message: "Username is required"})
    }

    if(!password) {
        return res.status(400).json({message: "Password is required"})
    }

    if(!confirmPassword) {
        return res.status(400).json({message: "Confirm password is required"})
    }

    if(roleid <= 1) {
        return res.status(400).json({message: "Role is required"})
    }

    if(roleid == 2) {
        if(!req.body.specialities || req.body.specialities.length < 1) {
            return res.status(400).json({message: "Specialities are required for new therapists"})
        }
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = await User.createUser(name, username,hashPassword, roleid)
    if (roleid == 2) {
        const message = {
            type: 'therapist_created',
            data: {
                username: user.username,
                name: user.name,
                specialities: specialities
            }
        };
        await sendMessage(message);
    }
    return res.status(200).json(user);
} catch (error) {
    console.log(error)
    if(error.code === "23505") {
        return res.status(400).json({message: "Username already exists"})
    }
    return res.status(500).json({message: "Internal Server Error"})
}
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username) {
            return res.status(400).json({message: "Username is required"})
        }
        if(!password) {
            return res.status(400).json({message: "Password is required"})
        }
        const user = await User.getByUsername(username)
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const isMatch = bcrypt.compareSync(password, user.password)
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        if(user.disabled) {
            return res.status(400).json({message: "User is disabled"})
        }
        const token = jwt.sign({username: user.username, roleid: user.roleid}, process.env.JWT_SECRET, {expiresIn: "1d"})
        return res.status(200).json({token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

exports.viewProfile = async (req, res) => {
    try {
        let username = req.user.username
        if(!username) {
            username = req.params.username
            if(!username) {
                return res.status(400).json({message: "Username is required"})
            }
        }

        const user = await User.getByUsername(username)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.getByUsername(req.params.username)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

exports.disableUser = async (req, res) => {
    try {
        if(req.params.username === req.user.username) {
            return res.status(400).json({message: "You cannot disable your own account"})
        }
        const user = await User.disableUser(req.params.username)
        return res.status(200).json(user)
 
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

exports.getDisabledUsers = async (req, res) => {
    try {
        const users = await User.getDisabledUsers()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

exports.enableUser = async (req, res) => {
    try {
        const user = await User.enableUser(req.params.username)
        return res.status(200).json(user)
 
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

exports.listUsers = async (req, res) => {
    try {
    
    const queryParams = Object.keys(req.query).length > 0 ? req.query : null
    const users = await User.getUsers(queryParams)
    return res.status(200).json(users)
    }

    catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
 
    }
}

exports.listRoles = async(req, res) => {
    try {
        const roles = await Role.getRoles()
        return res.status(200).json(roles)
        }
    
        catch (error) {
            console.log(error)
            return res.status(500).json({message: "Internal Server Error"})
     
        }
}