import { Router } from "express";
import passport from "passport";
import initializePassport from "../../config/passport.config.js";
import {
  registerUser,
  failRegister,
  loginUser,
  failLogin,
  logoutUser,
  restorePasswordForm,
  restorePassword,
  githubAuth,
  githubcallback,
  editProfileForm,
  editprofile
} from "../../controllers/user.controller.js";

const router = Router();
initializePassport();

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister", failureFlash: true }), registerUser);
router.get("/failregister", failRegister);

router.post("/login", passport.authenticate("login", { failureRedirect: "api/sessions/faillogin", failureFlash: true }), loginUser);
router.get("/faillogin", failLogin);

router.post("/logout", logoutUser);

router.get("/restorePassword", restorePasswordForm);
router.post("/restorePassword", restorePassword);

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}), githubAuth);
router.get("/githubcallback", passport.authenticate ("github", { failureRedirect: "/login"}), githubcallback);

router.get("/editprofile", editProfileForm);
router.post("/editprofile", editprofile);

export default router;

