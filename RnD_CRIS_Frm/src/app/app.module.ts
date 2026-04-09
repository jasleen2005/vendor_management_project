// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SubscriberFormComponent } from './subscriber-form/subscriber-form.component';
import { EmployeeAccessComponent } from './employee-access/employee-access.component';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';  // Import the Dialog Component
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './loader/loader.component';
import { LoginComponent } from './login/login.component';
import { CrisadminComponent } from './crisadmin/crisadmin.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EmailComponent } from './email/email.component';  // Add this
import { EmailService } from './email.service'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserAccessComponent } from './user-access/user-access.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    VendorFormComponent,
    LandingPageComponent,
    SubscriberFormComponent,
    EmployeeAccessComponent,
    DialogConfirmationComponent,
    LoaderComponent,
    LoginComponent,
    CrisadminComponent,
    CreateUserComponent,
    EmailComponent,
    UserAccessComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, 
    MatDialogModule, BrowserAnimationsModule ,
    MatFormFieldModule,
    MatSelectModule,
  ],
  // providers: [],
  // providers: [EmailService] ,
  providers: [
    EmailService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  
})

export class AppModule { }

