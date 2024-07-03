import { Router } from "express";
import passport from "passport";
import initializePassport from "../../config/passport.config.js";
import * as userController from "../../controllers/user.controller.js"

const router = Router();
initializePassport()

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), userController.registerUser)
router.get("/failregister", userController.failRegister)

router.post("/login", passport.authenticate("login", { failureRedirect: "api/sessions/faillogin" }), userController.loginUser)
router.get("/faillogin", userController.failLogin)

router.post("/logout", userController.logoutUser)

router.get("/restorePassword", userController.restorePasswordForm)
router.post("/restorePassword", userController.restorePassword)

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}), userController.githubAuth)
router.get("/githubcallback", passport.authenticate ("github", { failureRedirect: "/login"}), userController.githubcallback)

router.get("/editprofile", userController.efitProfileForm)
router.post("/editprofile", userController.editprofile)

export default router;
