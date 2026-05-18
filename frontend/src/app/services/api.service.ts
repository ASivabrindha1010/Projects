import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  makeBooking(bookingData: any) {
    return this.http.post(`${this.baseUrl}/bookings/request`, bookingData);
  }

  buyProduct(orderData: any) {
    return this.http.post(`${this.baseUrl}/products/buy`, orderData);
  }
}
