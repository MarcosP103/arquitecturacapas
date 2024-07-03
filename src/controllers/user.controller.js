import userService from "../services/user.service.js";
import { createHash } from "../utils.js";

export const registerUser = async (req, res) => {
  try {
    const userData = req.user;
    const newUser = await userService.createUser(userData);
    res.send({ status: "success", message: "Usuario registrado" });
  } catch (err) {
    console.error("Error al registrar el usuario.", err);
    res.status(500).send("Error al registrar al usuario.");
  }
};

export const failRegister = (req, res) => {
  console.log("Estrategia fallida");
  res.send({ error: "Fallo" });
};

export const loginUser = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incompletos" });
  try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cartId: req.user.cartId,
    };
    console.log(req.session.user);
    res.redirect("/api/products");
  } catch (err) {
    res.status(500).send("Error al iniciar sesión");
  }
};

export const failLogin = (req, res) => {
  res.send({ error: "Login fallido." });
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/login");
  });
};

export const restorePasswordForm = (req, res) => {
  res.render("resPass");
};

export const restorePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Datos incompletos" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("Usuario no encontrado");

    user.password = createHash(newPassword);
    await user.save();
    res.send("Contraseña actualizada correctamente");
  } catch (error) {
    res.status(500).send("Error al restaurar la contraseña");
  }
};

export const githubAuth = (req, res) => {};

export const githubcallback = (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  res.redirect("/");
};

export const efitProfileForm = (req, res) => {
  res.render("editprofile", { user: req.user });
};

export const editprofile = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("El email ya está registrado");
    }

    const newUser = new userModel({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    });
    await newUser.save();
    req.session.user = newUser;
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al completar el perfil");
  }
};
