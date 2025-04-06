import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menuOpen = false;
  addAdminForm: FormGroup;
  addAdminModal: any;
  
  constructor(
    private router: Router, 
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
  
    this.addAdminForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required]]
    });
  }
  
  ngOnInit() {
   
    document.addEventListener('DOMContentLoaded', () => {
      const modalElement = document.getElementById('addAdminModal');
      if (modalElement) {
        this.addAdminModal = new  bootstrap.Modal(modalElement);
      }
    });
  }
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  logout() {
    this.authService.logout();
  }
  

  openAddAdminModal() {
    if (this.addAdminModal) {
      this.addAdminModal.show();
    } else {
      const modalElement = document.getElementById('addAdminModal');
      if (modalElement) {
        this.addAdminModal = new  bootstrap.Modal(modalElement);
        this.addAdminModal.show();
      }
    }
  }
  

  onSubmitAdmin() {
    if (this.addAdminForm.valid) {
      
      const adminData = {
        ...this.addAdminForm.value,
        role: ['admin'] 
      };
      
      
      this.authService.singUp(adminData).subscribe({
        next: (response: ApiResponse<any>) => {
          console.log('Admin added successfully:', response);
          
          
          if (this.addAdminModal) {
            this.addAdminModal.hide();
          }
          
         
          this.addAdminForm.reset();
          
         
          alert('Admin added successfully!');
        },
        error: (error: any) => {
          console.error('Failed to add admin:', error);
          
          alert('Failed to add admin. Please try again.');
        }
      });
    }
  }
}