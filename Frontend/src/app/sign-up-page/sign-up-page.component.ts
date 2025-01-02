import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginPageComponent } from '../login-page/login-page.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpService } from '../service/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  constructor(private ngxService: NgxUiLoaderService) {}
  httpService = inject(HttpService); 
  router = inject(Router);
  errorMessage: string = '';

  SignUpForm = new FormGroup({
    Name: new FormControl('',[
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')
    ]),
    Email: new FormControl('',[
      Validators.required
    ]),
    PhoneNumber: new FormControl('',[
      Validators.required,
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$') // Only numbers allowed
    ]),
    password: new FormControl('',[
      Validators.required,
      Validators.minLength(8), // Minimum length of 8 characters
      Validators.pattern(/[A-Z]/), // At least one uppercase letter
      Validators.pattern(/[a-z]/), // At least one lowercase letter
      Validators.pattern(/[0-9]/), // At least one digit
      Validators.pattern(/[@$!%*?&#]/) // At least one special character
    ]),
    
  });

  ngOnInit(){

  }

  isFieldInvalid(field: string): boolean {
    const control = this.SignUpForm.get(field);
    return !!(control?.invalid && ((control?.touched ?? false) || (control?.dirty ?? false)));
  }
  
  isFieldTouched(field: string): boolean {
    const control = this.SignUpForm.get(field);
    return (control?.touched ?? false) || (control?.dirty ?? false);
  }
 
  SignUp(){
    this.ngxService.start();

    // If the form is invalid, mark all fields as touched to show validation errors and stop execution
    if (this.SignUpForm.invalid) {
      this.SignUpForm.markAllAsTouched();
      // Show error alert for missing details
      const validationErrorAlert = document.getElementById('validationErrorAlert');
      if (validationErrorAlert) validationErrorAlert.style.display = 'block';
  
      // Auto-hide the alert after 3 seconds
      setTimeout(() => {
        if (validationErrorAlert) validationErrorAlert.style.display = 'none';
      }, 3000);

      this.ngxService.stop();
      return;
    }
    const SignUpFormData = this.SignUpForm.value;
    const data = {
      Name: SignUpFormData.Name ,
      Email:  SignUpFormData.Email,
      PhoneNumber: SignUpFormData.PhoneNumber ,
      password:  SignUpFormData.password
    }
    this.httpService.SignUpComplaiant(data).subscribe(
      (response) => {
        console.log(' complainant sign up Form submitted successfully!', response);
        this.errorMessage = ''; // Clear any previous error messages
        // this.ngxService.stop();
        // this.SignUpForm.reset();
         // Reset the form after successful submission
         this.SignUpForm.reset();
  
         // Show success alert
         const successAlert = document.getElementById('successAlert');
         if (successAlert) successAlert.style.display = 'block';
   
         // Auto-hide the alert after 3 seconds
         setTimeout(() => {
           if (successAlert) successAlert.style.display = 'none';
         }, 3000);
   
         this.ngxService.stop();
        
      },
      (error) => {
        console.error('Error occurred:', error);
             // Show error alert for backend error
             const errorAlert = document.getElementById('errorAlert');
             if (errorAlert) errorAlert.style.display = 'block';
       
             // Auto-hide the alert after 3 seconds
             setTimeout(() => {
               if (errorAlert) errorAlert.style.display = 'none';
             }, 3000);

        this.ngxService.stop();
        if (error.status === 400) {
          console.log('Email or phonenumber already exits');
          this.errorMessage = 'Email or phonenumber already exits'; // Set the error message
        } 
        
      }
    );
  }
  
   
  // Function to close the alert manually
  closeAlert(alertId: string) {
    const alert = document.getElementById(alertId);
    if (alert) alert.style.display = 'none';
  }
  

}
