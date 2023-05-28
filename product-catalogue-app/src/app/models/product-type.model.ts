import { Product } from '../models/product.model'

export interface ProductType {
  id: number;
  name: string;
  products: Product[];
}