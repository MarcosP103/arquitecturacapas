import cartModel from '../dao/models/carts.model.js';
import productModel from '../dao/models/products.model.js';

const createCart = async () => {
  try {
    const newCart = new cartModel({ products: [] });
    await newCart.save();
    return newCart;
  } catch (error) {
    console.error("Error al crear el carrito: ", error);
    throw error;
  }
};

const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.error("Carrito no encontrado por ID: ", cartId);
      return null;
    }

    const product = await productModel.findById(productId);
    if (!product) {
      console.error("Producto no encontrado por ID: ", productId);
      return null;
    }

    const productInCart = cart.products.find((item) => item.productId.equals(productId));
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al agregar el producto al carrito: ", error);
    throw error;
  }
};

const getCartById = async (cartId) => {
  try {
    const cart = await cartModel.findById(cartId).populate("products.productId").lean();
    if (!cart) {
      console.error("Carrito no encontrado por ID: ", cartId);
      return null;
    }
    return cart;
  } catch (error) {
    console.error("Error al obtener el carrito por ID: ", error);
    throw error;
  }
};

const updateCart = async (cartId, products) => {
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.error("Carrito no encontrado por ID: ", cartId);
      return null;
    }

    cart.products = products;
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al actualizar el carrito: ", error);
    throw error;
  }
};

const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.error("Carrito no encontrado por ID: ", cartId);
      return null;
    }

    const productInCart = cart.products.find((item) => item.productId.equals(productId));
    if (!productInCart) {
      console.error("Producto no encontrado en el carrito: ", productId);
      return null;
    }

    productInCart.quantity = quantity;
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito: ", error);
    throw error;
  }
};

const removeProductFromCart = async (cartId, productId) => {
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.error("Carrito no encontrado por ID: ", cartId);
      return null;
    }

    cart.products = cart.products.filter((item) => !item.productId.equals(productId));
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al eliminar el producto del carrito: ", error);
    throw error;
  }
};

const clearCart = async (cartId) => {
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.error("Carrito no encontrado por ID: ", cartId);
      return null;
    }

    cart.products = [];
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al vaciar el carrito: ", error);
    throw error;
  }
};

export default {
  createCart,
  addProductToCart,
  getCartById,
  updateCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart
};