import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from '../app-routing.module';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AppRoutingModule,
    
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent
  ]
})
export class SharedModule { }
