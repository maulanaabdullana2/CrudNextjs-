const router = require("express").Router();
const Auth = require("../controllers/authController"); 
const authenticate = require("../middleware/authenticate");
router.post("/login", Auth.login);
router.post("/register", Auth.register);
router.get("/me", authenticate, Auth.currentuser);
router.post("/login-google", Auth.loginWithgoogle);


module.exports = router;
