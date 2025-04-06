import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required ,Validators.minLength(6), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required]]
    });
  }


  onSubmit(): void {
    if (this.registerForm.valid) {
      
      console.log('Register Form Submitted:', this.registerForm.value);
      
      this.authService.singUp(this.registerForm.value).subscribe({
        next: (data: ApiResponse<any>) => {
          // console.log("data");
          // this.apiService.onResponseSuccess('Success',"sing up success")
          alert('sing up success')
        
          this.router.navigate(['/login']);
                 },error: (error: any) => {
          console.log(error);
          alert('sing up failed')
          // this.apiService.onResponsefaild({message : "sing up failed"})
        }
      })   
    }
  }
}