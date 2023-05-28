import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../models/product.model';
import { ProductType } from '../models/product-type.model';

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
      <div>
        <label for="productType">Product Type:</label>
        <select formControlName="productType" (change)="updateProductTypeName()" required>
          <option *ngFor="let type of productTypes" [value]="type.id">{{ type.name }}</option>
        </select>
      </div>
      <button type="submit" [disabled]="productForm.invalid">{{ mode === 'add' ? 'Add' : 'Update' }}</button>
    </form>
  `
})
export class ProductFormComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() product!: Product;
  @Output() productAdded: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() productUpdated: EventEmitter<Product> = new EventEmitter<Product>();

  productForm: FormGroup;
  productTypes: ProductType[] = [];
  productTypeName: string = '';

  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      productType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductTypes();
  }

  loadProductTypes(): void {
    this.productService.getProductTypes().subscribe(
      (response: any) => {
        this.productTypes = response.map((item: any) => {
          return {
            id: item.id,
            name: item.name
          };
        });

        if (this.mode === 'edit') {
          this.patchProductFormValues();
          this.updateProductTypeName();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  patchProductFormValues(): void {
    this.productForm.patchValue({
      name: this.product.name ?? '',
      description: this.product.description ?? '',
      productType: this.product.productTypeId ?? ''
    });
  }

  updateProductTypeName(): void {
    const productTypeId = this.productForm.value.productType;
    const productType = this.productTypes.find((type) => type.id === productTypeId);
    this.productTypeName = productType ? productType.name : '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = {
      id: 0, // Temporary ID
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      productTypeId: this.productForm.value.productType
    };

    if (this.mode === 'add') {
      this.productService.createProduct(product).subscribe(
        (createdProduct) => {
          this.productAdded.emit(createdProduct);
          this.resetForm();
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.mode === 'edit') {
      const updatedProduct: Product = {
        id: this.product.id,
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        productTypeId: this.productForm.value.productType
      };

      this.productService.updateProduct(updatedProduct).subscribe(
        () => {
          this.productUpdated.emit(updatedProduct);
          this.resetForm();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.productTypeName = '';
  }
}
