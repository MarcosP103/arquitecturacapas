import * as productService from '../services/products.service.js';
import Product from '../dao/models/products.model.js';

// Para la obtención de productos desde la API
export const getProductsApi = async (req, res) => {
  try {
    const products = await Product.find();
    const userName = req.session.user ? `${req.session.user.first_name} ${req.session.user.last_name}` : 'Invitado';
    res.render('products', { userName, products });
  } catch (err) {
    res.status(500).send('Error al obtener los productos');
  }
};

//Realtime

export const getRealTimeProducts = async (req, res) => {
  try {
    const products = await productService.uploadProducts()
    res.render("index", { products, length: products.length > 0 })
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos. "})
  }
}

// Para manejar la obtención de productos desde las rutas normales
export const getProducts = async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;
    limit = parseInt(limit) || 10
    page = parseInt(page) || 1
    sort = sort || ''
    query = query || ''

    let filter = {}
    if (query) {
      const categoryRegex = new RegExp(`^${query}$`, 'i')
      filter = { category: categoryRegex}
    }

    const options = {
      page,
      limit,
      sort: sort ? { price: sort === 'asc' ? 1: -1 } : {},
      lean: true
    }
    
    const result = await productService.getProducts(filter, options);

    const { docs, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;
    const prevLink = hasPrevPage ? `${req.baseUrl}/get?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `${req.baseUrl}/get?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

    res.render('index', { products: result.docs, prevLink: prevLink, nextLink: nextLink });
  } catch (error) {
    console.error("No se pudieron obtener los productos", error);
    res.status(500).json({ status: 'error', message: "No se pudieron obtener los productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const pId = req.params.pid;
    const product = await productService.getProductById(pId);

    if (!product) {
      return res.status(404).send({ status: "error", error: "Producto no encontrado" });
    }

    res.render('productsDet', {
      id: product._id,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails
    });
  } catch (error) {
    console.error("No se pudo obtener el producto por ID", error);
    res.status(500).send({ status: "error", error: "Error interno del servidor" });
  }
};

export const addProduct = async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  try {
    await productService.addProduct(title, description, code, price, status, stock, category, thumbnails);
    res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productMod = req.body;

  try {
    const updatedProduct = await productService.updateProduct(id, productMod);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto modificado correctamente", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar el producto" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await productService.deleteProduct(id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
