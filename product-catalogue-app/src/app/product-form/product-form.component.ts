import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  styleUrls: ['./product-form.component.scss'],
  template: `
    <h2>{{ mode === 'add' ? 'Add Product' : 'Edit Product' }}</h2>
    <form [formGroup]="productForm" (submit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input type="text" formControlName="name" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea formControlName="description" required></textarea>
      </div>
      <button type="submit" [disabled]="productForm.invalid">{{ mode === 'add' ? 'Add' : 'Update' }}</button>
    </form>
  `
})
export class ProductFormComponent implements OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() product!: Product;
  @Output() productAdded: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() productUpdated: EventEmitter<Product> = new EventEmitter<Product>();

  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.product) {
      this.productForm.setValue({
        name: this.product.name ?? '',
        description: this.product.description ?? ''
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const newProduct: Product = {
      id: 0, // Assigning a temporary ID
      name: this.productForm.value.name ?? '',
      description: this.productForm.value.description ?? ''
    };

    if (this.mode === 'add') {
      this.productService.addProduct(newProduct).subscribe((addedProduct) => {
        console.log('Product added successfully');
        this.productAdded.emit(addedProduct); // Emit event to notify parent component
        this.resetForm();
      });
    } else if (this.mode === 'edit') {
      const updatedProduct: Product = {
        id: this.product.id,
        name: this.productForm.value.name ?? '',
        description: this.productForm.value.description ?? ''
      };

      this.productService.updateProduct(updatedProduct).subscribe(() => {
        console.log('Product updated successfully');
        this.productUpdated.emit(updatedProduct); // Emit event to notify parent component
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
