import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './admin-products.html'
})
export class AdminProducts implements OnInit {
  allProducts: any[] = [];
  newProduct: any = {
    name: '',
    category: 'Product', 
    price: null,
    stock: null,
    duration: '',
    image: '',
    description: ''
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchProducts();
    }
  }

  fetchProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products/all-products').subscribe({
      next: (res) => this.allProducts = res,
      error: (err) => console.error(err)
    });
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) {
      alert("Please fill name and price!");
      return;
    }

    const payload = { ...this.newProduct };
    
    if (this.newProduct.category === 'Service') {
      delete payload.stock;
    } else {
      delete payload.duration;
    }

    this.http.post('http://localhost:5000/api/products/add', payload).subscribe({
      next: () => {
        alert("Added Successfully!");
        this.fetchProducts(); 
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert("Error adding item. Check console for details.");
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm("Are you sure?")) {
      this.http.delete(`http://localhost:5000/api/products/${id}`).subscribe({
        next: () => this.fetchProducts(),
        error: (err) => console.error(err)
      });
    }
  }

  resetForm() {
    this.newProduct = {
      name: '',
      category: 'Product',
      price: null,
      stock: null,
      duration: '',
      image: '',
      description: ''
    };
  }
}