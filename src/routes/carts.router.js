import { Router } from 'express';
import * as cartController from '../controllers/carts.controller.js';

const router = Router();

router.post("/", cartController.createCart);

router.post("/:cid/products/:pid", cartController.addProductToCart);

router.get("/:cid", cartController.getCartById);

router.put("/:cid", cartController.updateCart);

router.put("/:cid/products/:pid", cartController.updateProductQuantity);

router.delete("/:cid/products/:pid", cartController.removeProductFromCart);

router.delete("/:cid", cartController.clearCart);

export default router;
