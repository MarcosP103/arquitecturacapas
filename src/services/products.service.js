import ProductManagerMongoose from '../dao/managerMongo/productManagerMongo.js';

export class ProductService {
  constructor () {
    this.productManager = new ProductManagerMongoose()
  }

  async uploadProducts() {
    return await this.productManager.uploadProducts()
  }

  async getProducts(){
    return await this.productManager.getProducts(filter, options)
  }

  async getProductById (id) {
  return await this.productManager.getProductsById(id);
  }

  async addProduct(title, description, code, price, status, stock, category, thumbnails) {
  return await this.productManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
 }

 async updateProduct(id, productMod) {
  return await this.productManager.modProduct(id, productMod);
 }

 async deleteProduct(id) {
  return await this.productManager.delProduct(id);
 }

}
