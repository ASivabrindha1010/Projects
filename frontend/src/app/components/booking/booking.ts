import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './booking.html'
})
export class BookingComponent implements OnInit {
  selectedService: any = null;
  allSlots: any[] = [];
  selectedSlot: string = '';
  selectedDate: string = new Date().toLocaleDateString('en-CA');
  paymentMethod: string = '';
  bookingSuccess: boolean = false;
  receiptData: any = null;
  isProcessing: boolean = false;

  cardDetails = {
    number: '',
    expiry: '',
    cvv: ''
  };

  constructor(
    private router: Router, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const serviceData = localStorage.getItem('selectedService');
      if (serviceData) {
        this.selectedService = JSON.parse(serviceData);
        this.fetchSlots();
      }
    }
  }

  fetchSlots() {
    this.http.get<any[]>(`http://localhost:5000/api/bookings/available-slots/${this.selectedDate}`)
      .subscribe({
        next: (data) => this.allSlots = data,
        error: (err) => console.error(err)
      });
  }

  selectSlot(slot: any) {
    if (slot.available) this.selectedSlot = slot.time;
  }

  startProcessing() {
    if (this.paymentMethod === 'Card') {
      if (this.cardDetails.number.length !== 16 || !this.cardDetails.expiry || this.cardDetails.cvv.length !== 3) {
        alert('Please enter valid 16-digit Card Number, Expiry, and 3-digit CVV');
        return;
      }
    }

    this.isProcessing = true;
    setTimeout(() => {
      this.confirmBooking();
    }, 3000);
  }

  confirmBooking() {
    if (isPlatformBrowser(this.platformId)) {
      const userDataStr = localStorage.getItem('user');
      if (!userDataStr) {
        this.isProcessing = false;
        alert('User not logged in');
        this.router.navigate(['/login']);
        return;
      }

      const userData = JSON.parse(userDataStr);
      const bookingData = {
        userId: userData._id,
        totalAmount: this.selectedService.price,
        paymentStatus: 'Success',
        paymentType: this.paymentMethod,
        serviceId: this.selectedService._id,
        serviceName: this.selectedService.name,
        startTime: this.selectedSlot,
        duration: parseInt(this.selectedService.duration) || 0,
        date: this.selectedDate
      };

      this.http.post('http://localhost:5000/api/bookings/process-booking', bookingData)
        .subscribe({
          next: (res: any) => {
            userData.loyaltyPoints += (res.earned || 0);
            localStorage.setItem('user', JSON.stringify(userData));
            
            this.receiptData = {
              ...res.bookingDetails,
              amount: bookingData.totalAmount 
            };
            
            this.isProcessing = false;
            this.bookingSuccess = true;
          },
          error: (err) => {
            this.isProcessing = false;
            alert('Booking failed');
          }
        });
    }
  }

  downloadReceipt() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}