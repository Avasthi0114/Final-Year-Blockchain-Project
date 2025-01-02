import { Component, inject } from '@angular/core';
import { HttpService } from '../service/http.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-police-sign-up-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './police-sign-up-page.component.html',
  styleUrl: './police-sign-up-page.component.css'
})
export class PoliceSignUpPageComponent {
  constructor(private ngxService: NgxUiLoaderService) {} 
  errorMessage: string = '';
  httpService = inject(HttpService); 
  // router = inject(Router);
  
  PoliceSignUpForm = new FormGroup({
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
     PoliceOfficerRank: new FormControl('',[
      Validators.required
    ]),
    PoliceOfficerId: new FormControl('',[
      Validators.required
    ]),
    PoliceStationId: new FormControl('',[
      Validators.required
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
    const control = this.PoliceSignUpForm.get(field);
    return !!(control?.invalid && ((control?.touched ?? false) || (control?.dirty ?? false)));
  }
  
  isFieldTouched(field: string): boolean {
    const control = this.PoliceSignUpForm.get(field);
    return (control?.touched ?? false) || (control?.dirty ?? false);
  }
 
  SignUp(){
    this.ngxService.start();

    // If the form is invalid, mark all fields as touched to show validation errors and stop execution
    if (this.PoliceSignUpForm.invalid) {
      this.PoliceSignUpForm.markAllAsTouched();

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
    const  PoliceSignUpFormData = this.PoliceSignUpForm.value;
    const data = {
      Name:  PoliceSignUpFormData.Name ,
      Email:   PoliceSignUpFormData.Email,
      PhoneNumber:  PoliceSignUpFormData.PhoneNumber ,
      PoliceOfficerRank:  PoliceSignUpFormData.PoliceOfficerRank,
      PoliceOfficerId:   PoliceSignUpFormData.PoliceOfficerId,
      PoliceStationId:  PoliceSignUpFormData.PoliceStationId,
      password:   PoliceSignUpFormData.password
    }
    this.httpService.SignUpPolice(data).subscribe(
      (response) => {
        console.log('Form submitted successfully!', response);
        this.errorMessage = ''; // Clear any previous error messages
        // this.ngxService.stop();
        // this.PoliceSignUpForm.reset();

           // Reset the form after successful submission
           this.PoliceSignUpForm.reset();
  
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
          console.log('Email or phonenumber or PoliceOfficerId already exits');
          this.errorMessage = 'Email or phonenumber or PoliceOfficerId already exits'; // Set the error message
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
