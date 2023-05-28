import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product.model';
import { ProductType } from '../models/product-type.model';

@Component({
  selector: 'app-product-list',
  styleUrls: ['./product-list.component.scss'],
  template: `
    <h2>Product List</h2>
    <ul>
      <li *ngFor="let product of products">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p>Product Type: {{ getProductTypeName(product.productTypeId) }}</p>
        <button (click)="editProduct(product)">Edit</button>
        <button (click)="deleteProduct(product.id)">Delete</button>
      </li>
    </ul>

    <app-product-form [mode]="'add'" (productAdded)="onProductAdded($event)"></app-product-form>
    <app-product-form [mode]="'edit'" *ngIf="selectedProduct !== null" [product]="selectedProduct" (productUpdated)="onProductUpdated($event)"></app-product-form>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productTypes: ProductType[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadProductTypes();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateProductTypeName(): void {
    for (const product of this.products) {
      const productType = this.productTypes.find((type) => type.id === product.productTypeId);
      product.productTypeName = productType ? productType.name : '';
    }
  }

  loadProductTypes(): void {
    this.productService.getProductTypes().subscribe(
      (types: ProductType[]) => {
        this.productTypes = types;
        this.updateProductTypeName();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProductTypeName(productTypeId: number): string {
    console.log('rerender');
    const productType = this.productTypes.find((type) => type.id === productTypeId);
    return productType ? productType.name : '';
  }

  onProductAdded(product: Product): void {
    this.products.push(product);
  }

  onProductUpdated(updatedProduct: Product): void {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.products[index].productTypeName = 'laptop'
      console.log('Product updated successfully:', updatedProduct);
      this.selectedProduct = null; // Clear the selected product
    }
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter((p) => p.id !== productId);
        console.log('Product deleted successfully:', productId);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
