import userModel from "../dao/models/user.model.js"
import { createHash, isValidPassword } from "../utils.js";

class UserService {
    async createUser(userData) {
        try {
            const existingUser = await this.findUserByEmail(userData.email);
            if (existingUser) {
                throw new Error("El email ya está registrado");
            }
            const user = new userModel(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error (`Error al crear el usuario: ${error.message}`)
        }
    }

    async findUserByEmail(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            throw new Error (`Error al buscar el usuario por email: ${error.message}`)
        }
    }

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await userModel.findById(userId);
            if (!user) throw new Error("Usuario no encontrado");
            user.password = createHash(newPassword);
            await user.save();
            return user;
        } catch (error) {
            throw new Error (`Error al actualizar la contraseña: ${error.message}`)
        }
    }

    async getUserById(userId) {
        try {
            return await userModel.findById(userId).populate("cartId").lean();
        } catch (error) {
            throw new Error(`Error al obtener el usuario por ID: ${error.message}`);
        }
    }

    async updateUserProfile(userId, updatedData) {
        try {
            const user = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
            if (!user) throw new Error("Usuario no encontrado");
            return user;
        } catch (error) {
            throw new Error(`Error al actualizar el perfil del usuario: ${error.message}`);
        }
    }

    async deleteUser(userId) {
        try {
            const user = await userModel.findByIdAndDelete(userId);
            if (!user) throw new Error("Usuario no encontrado");
            return user;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }

    async listUsers() {
        try {
            return await userModel.find().lean();
        } catch (error) {
            throw new Error(`Error al listar los usuarios: ${error.message}`);
        }
    }

    async validatePassword(userId, candidatePassword) {
        try {
            const user = await userModel.findById(userId);
            if (!user) throw new Error("Usuario no encontrado");
            return await isValidPassword(candidatePassword, user.password);
        } catch (error) {
            throw new Error(`Error al validar la contraseña: ${error.message}`);
        }
    }
}

export default new UserService();