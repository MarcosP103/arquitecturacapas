import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userService from "../services/user.service.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy

const initializePassport = () => {
  passport.use("github", new GitHubStrategy({
        clientID: "Iv23liSYHTwwlrcbPS9c",
        clientSecret: "8ed53d3b958654e51a1a38e29199f257400ce30f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          if (!profile._json.email) {
            return done(null, false, { message:
                "El email no fue otorgado por GitHub. Por favor, complete su perfil.",
            });
          }

          let user = await userService.findUserByEmail(profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name || profile.username,
              last_name: profile._json.last_name || profile.usaername,
              age: null,
              email: profile._json.email,
              password: createHash("defaultpassword"),
            };
            let result = await userService.createUser(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use("register",new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false, {message: "Todos los campos son requeridos"});
          }
  
          let user = await userService.findUserByEmail( email )
          if (user) {
            console.log("El usuario ya existe")
            return done(null, false, {message: "El mail ya existe"})
          }
  
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
  
          let result = await userService.createUser(newUser);
  
          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );
  
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.getUserById(id);
      done(null, user);
    } catch (error) {
      done (error)
    }
  });
};

passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
          const user = await userService.findUserByEmail( username );
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!isValidPassword(user, password)) return done(null, false, { message: "Password incorrecta" });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

export default initializePassport;
