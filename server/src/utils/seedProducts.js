import Product from '../models/Product.js';
import products from '../data/products.js';

export async function seedProducts() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  return products.length;
}
