import * as cartService from '../services/carts.service.js';

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad invalida" });
  }

  try {
    const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
    if (!updatedCart) {
      return res.status(400).json({ error: "Carrito o producto no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

export const getCartById = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const updateCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Debe ser un arreglo de productos" });
  }

  try {
    const updatedCart = await cartService.updateCart(cid, products);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
};

export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad invalida" });
  }

  try {
    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
  }
};

export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
};

export const clearCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const updatedCart = await cartService.clearCart(cid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};
