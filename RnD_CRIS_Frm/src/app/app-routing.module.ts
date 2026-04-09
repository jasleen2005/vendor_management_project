// src/app/app-routing.module.ts
import { AuthGuard } from './auth.guard'; //to add login

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SubscriberFormComponent } from './subscriber-form/subscriber-form.component';
import { EmployeeAccessComponent } from './employee-access/employee-access.component';
import { CrisadminComponent } from './crisadmin/crisadmin.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { EmailComponent } from './email/email.component';
// Start - to add login page
import { LoginComponent } from './login/login.component';
import { UserAccessComponent } from './user-access/user-access.component';
// End - to add login page
const routes: Routes = [
  // { path: '', redirectTo: '/landing', pathMatch: 'full' },  comment to add login page
 // Start - to add login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingPageComponent, canActivate: [AuthGuard] },
  { path: 'vendor-form', component: VendorFormComponent },
  { path: 'subscriber-form', component: SubscriberFormComponent },
  { path: 'employee-access', component: EmployeeAccessComponent },  
  { path: 'crisadmin', component: CrisadminComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'user-access', component: UserAccessComponent },
  { path: 'email', component: EmailComponent },
  { path: '**', redirectTo: '/login' }, // to add login page -Catch-all route for unknown paths
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }