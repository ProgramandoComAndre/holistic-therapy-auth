const { register, login, viewProfile, getUserByUsername, disableUser, getDisabledUsers, enableUser, listUsers } = require("../controllers/UserController");
const authenticate = require("../middlewares/auth/authenticate");
const authorize = require("../middlewares/auth/authorize");
const ROLES = require("../middlewares/auth/roles.config");
const router = require("express").Router();

router.post("/", authenticate, authorize([ROLES.ADMIN]), register);
router.post('/auth', login)
router.get('/profile', authenticate, viewProfile)
router.get('/profile/:username', authenticate, authorize([ROLES.ADMIN]),getUserByUsername)
router.patch('/profile/disable/:username', authenticate, authorize([ROLES.ADMIN]), disableUser)
router.get('/disabled/profiles', authenticate, authorize([ROLES.ADMIN]), getDisabledUsers)
router.patch('/profile/enable/:username', authenticate, authorize([ROLES.ADMIN]), enableUser)
router.get('/', authenticate, authorize([ROLES.ADMIN]), listUsers)
module.exports = router