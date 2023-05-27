import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  styleUrls: ['./product-list.component.scss'],
  template: `
    <h2>Product List</h2>
    <ul>
      <li *ngFor="let product of products">
        {{ product.name }} - {{ product.description }}
        <button (click)="editProduct(product)">Edit</button>
        <button (click)="deleteProduct(product.id)">Delete</button>
      </li>
    </ul>

    <app-product-form [mode]="'add'" (productAdded)="onProductAdded($event)"></app-product-form>
    <app-product-form [mode]="'edit'" *ngIf="selectedProduct !== null" [product]="selectedProduct" (productUpdated)="onProductUpdated($event)"></app-product-form>  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  onProductAdded(product: Product): void {
    this.products.push(product);
  }

  onProductUpdated(updatedProduct: Product): void {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      console.log('Product updated successfully:', updatedProduct);
      this.selectedProduct = null; // Clear the selected product
    }
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter((p) => p.id !== productId);
      console.log('Product deleted successfully:', productId);
    });
  }
}
