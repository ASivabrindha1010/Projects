import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; 
import { SignupComponent } from './components/signup/signup';
import { ProductsComponent } from './components/products/products.component';
import { SelectionComponent } from './components/selection/selection';
import { BookingComponent } from './components/booking/booking';
import { Profile } from './components/profile/profile';
import { AdminLogin } from './components/admin-login/admin-login';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminProducts } from './components/admin-products/admin-products'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'selection', component: SelectionComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'profile', component: Profile },
  { path: 'admin-login', component: AdminLogin },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'admin-products', component: AdminProducts },
  { path: 'admin-users', component: AdminDashboard } 
];