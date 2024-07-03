import userModel from "../models/user.model.js"
import cartsModel from "../models/carts.model.js";
import { createHash, isValidPassword } from "../utils.js";

class UserService {
    async createUser(userData) {
        const user = new userModel(userData);
        const newCart = new cartsModel();
        await newCart.save();

        user.cartId = newCart._id;
        await user.save();
        return user;
    }

    async findUserByEmail(email) {
        return await userModel.findOne({ email });
    }

    async updateUserPassword(userId, newPassword) {
        const user = await userModel.findById(userId);
        if (!user) throw new Error("Usuario no encontrado");
        user.password = createHash(newPassword);
        await user.save();
        return user;
    }

    async getUserById(userId) {
        return await userModel.findById(userId).populate("cartId").lean();
    }

    async updateUserProfile(userId, updatedData) {
        const user = await userModel.findByIdAndUpdate(userId, updatedData, { new: true})
        if (!user) throw new Error("Usuario no encontrado")
        return user
    }

    async deleteUser(userId) {
        const user = await userModel.findByIdAndDelete(userId)
        if(!user) throw new Error("Usuario no encontrado")
        return user
    }

    async listUsers() {
        return await userModel.find().lean()
    }

    async validatePassword(userId, candidatePassword) {
        const user = await userModel.findById(userId)
        if (!user) throw new Error ("Usuario no encontrado")
        return isValidPassword(candidatePassword, user.password)
    }
}

export default new UserService();