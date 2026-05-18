import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './selection.html',
  styleUrls: ['./selection.css']
})
export class SelectionComponent implements OnInit {
  mainCategory: string = ''; 
  selectedCategory: string = '';
  services: any[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedMain = localStorage.getItem('mainCategory');
      if (savedMain) this.mainCategory = savedMain;

      const category = localStorage.getItem('selectedCategory');
      if (category) {
        this.selectedCategory = category;
        this.loadCategory(category);
      }
    }
  }

  setMainCategory(type: string) {
    this.mainCategory = type;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mainCategory', type);
    }
  }

  loadCategory(category: string) {
    this.selectedCategory = category;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedCategory', category);
    }
    
    this.http.get<any[]>(`http://localhost:5000/api/products/category/${category}`)
      .subscribe({
        next: (data: any[]) => {
          this.services = data;
        },
        error: (err) => {
          console.error(err);
          this.services = [];
        }
      });
  }

  onLogout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToBooking(service: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedService', JSON.stringify(service));
    }
    this.router.navigate(['/booking']);
  }

  resetSelection() {
    this.selectedCategory = '';
    this.services = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('selectedCategory');
    }
  }

  goBack() {
    this.mainCategory = '';
    this.selectedCategory = '';
    this.services = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('mainCategory');
      localStorage.removeItem('selectedCategory');
    }
  }
}