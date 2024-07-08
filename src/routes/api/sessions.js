import { Router } from "express";
import passport from "passport";
import initializePassport from "../../config/passport.config.js";
import * as userController from "../../controllers/user.controller.js"

const router = Router();
initializePassport()

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister", failureFlash: true }), userController.registerUser)
router.get("/failregister", userController.failRegister)

router.post("/login", passport.authenticate("login", { failureRedirect: "api/sessions/faillogin", failureFlash: true }), userController.loginUser)
router.get("/faillogin", userController.failLogin)

router.post("/logout", userController.logoutUser)

router.get("/restorePassword", userController.restorePasswordForm)
router.post("/restorePassword", userController.restorePassword)

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}), userController.githubAuth)
router.get("/githubcallback", passport.authenticate ("github", { failureRedirect: "/login"}), userController.githubcallback)

router.get("/editprofile", userController.editProfileForm)
router.post("/editprofile", userController.editprofile)

export default router;
