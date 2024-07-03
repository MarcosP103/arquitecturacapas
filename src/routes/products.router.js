import { Router } from 'express';
import * as productController from '../controllers/products.controller.js';

const router = Router();

router.get('/realTimeProducts', productController.getProducts);

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProductById);

router.post("/", productController.addProduct);

router.put("/:pid", productController.updateProduct);

router.delete("/:pid", productController.deleteProduct);

export default router;
