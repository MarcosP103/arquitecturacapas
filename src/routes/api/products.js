import { Router } from 'express';
import { getProductsApi } from '../../controllers/products.controller.js';
import { isAuthenticated } from '../../middleware/auth.js';

const router = Router();

router.get('/', isAuthenticated, getProductsApi);

export default router;
