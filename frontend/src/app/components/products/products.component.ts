import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true, 
  imports: [CommonModule, HttpClientModule, FormsModule], 
  templateUrl: './products.component.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  productList: any[] = [];
  showModal: boolean = false;
  isProcessing: boolean = false;
  selectedProduct: any = null;
  selectedQuantity: number = 1;

  constructor(
    private productService: ProductService, 
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productList = data
          .filter((item: any) => item.category === 'Products')
          .map((item: any) => ({
            ...item,
            image: item.image || 'https://via.placeholder.com/200',
            description: item.description || 'High quality herbal care.',
            stock: item.stock || 0
          }));
      },
      error: (err) => console.error(err)
    });
  }

  openPaymentModal(product: any) {
    if (product.stock <= 0) {
      alert("Out of Stock!");
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData._id) {
      alert("Please login to continue");
      this.router.navigate(['/login']);
      return;
    }
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.showModal = true;
  }

  closeModal() {
    if (!this.isProcessing) {
      this.showModal = false;
      this.selectedProduct = null;
      this.selectedQuantity = 1;
    }
  }

  processPayment() {
    if (this.selectedQuantity > this.selectedProduct.stock) {
      alert("Selected quantity exceeds available stock!");
      return;
    }
    this.isProcessing = true;
    setTimeout(() => {
      this.completePurchase();
    }, 2500);
  }

  completePurchase() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const product = this.selectedProduct;

    if (!userData._id || !product) {
      this.isProcessing = false;
      alert("Session expired. Please login again.");
      return;
    }

    const orderData = {
      userId: userData._id,
      productId: product._id,
      productName: product.name,
      price: product.price * this.selectedQuantity,
      quantity: this.selectedQuantity,
      paymentStatus: 'Success',
      date: new Date()
    };

    this.http.post('http://localhost:5000/api/orders/add', orderData).subscribe({
      next: (res: any) => {
        this.isProcessing = false;
        this.showModal = false;
        
        if (res.totalPoints !== undefined) {
          userData.loyaltyPoints = res.totalPoints;
          localStorage.setItem('user', JSON.stringify(userData));
        }

        const receiptId = res.order ? res.order._id : Math.random().toString(36).substring(2, 9).toUpperCase();
        this.generateReceipt(orderData, receiptId);

        alert(`Order Placed Successfully! Total: ₹${orderData.price}`);
        this.loadProducts();
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isProcessing = false;
        console.error("Order Error:", err);
        alert('Payment processing failed');
      }
    });
  }

  goBack() {
    this.router.navigate(['/selection']);
  }

  getQrCodeUrl(): string {
    if (!this.selectedProduct) return '';
    // Format amount with 2 decimals (e.g. 300.00) so UPI apps don't ignore it
    const amount = (this.selectedProduct.price * this.selectedQuantity).toFixed(2);
    // Basic UPI URI format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=CURRENCY
    // You can replace 'abrindha1010-1@okaxis' with your actual Google Pay UPI ID
    const upiString = `upi://pay?pa=abrindha1010-1@okaxis&pn=TerraKind+E-commerce&am=${amount}&cu=INR`;
    
    // Encode the URI and request a QR code from a free QR code generator API
    const encodedUpi = encodeURIComponent(upiString);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUpi}`;
  }

  generateReceipt(orderData: any, receiptId: string) {
    const receiptContent = `
========================================
            TERRAKIND RECEIPT
========================================
Receipt ID    : ${receiptId}
Date & Time   : ${new Date().toLocaleString()}
Transaction   : Successful (QR Payment)

Product       : ${orderData.productName}
Quantity      : ${orderData.quantity}
Price per item: ₹${orderData.price / orderData.quantity}
----------------------------------------
TOTAL PAID    : ₹${orderData.price}
========================================
Thank you for going eco-friendly with TerraKind!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TerraKind_Receipt_${receiptId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}