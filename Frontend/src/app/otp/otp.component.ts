import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from '../service/http.service';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule


@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {
  otpErrorMessage: string = '';
  showOtpInput: boolean = true; // Show OTP input form
  otpForm: FormGroup;


  constructor(
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private httpClient: HttpClient,
    private httpService: HttpService
  ) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required]),
    });
  }


  submitOTP() {
    const email = localStorage.getItem('email');
    if (!email) {
      console.log('Email is missing in localStorage');
      return;
    }
 
    if (this.otpForm.valid) {
      const otpData = {
        Email: email, // Retrieve email stored during login
        otp: this.otpForm.value.otp,
      };
 
      this.verifyOTP(otpData); // Call the backend to verify OTP
    } else {
      console.log('OTP Form is invalid');
      this.otpForm.markAllAsTouched();
    }
  }
 


  verifyOTP(data: any) {
    this.ngxService.start(); // Show loader during verification


    this.httpClient.post('http://localhost:3000/verifyOTP', data).subscribe(
      (response: any) => {
        this.ngxService.stop(); // Stop loader


        alert(response.message); // Show success message


        // Navigate based on role after successful OTP verification
        // if (response.role === 'citizen') {
        //   console.log('Navigating to complainantdash');
        //   this.router.navigate(['/complainantdash']);
        // } else if (response.role === 'police') {
        //   this.router.navigate(['/policedash']);
        // }


        this.router.navigate(['/complainantdash']);
      },
      (error) => {
        this.ngxService.stop(); // Stop loader
        this.otpErrorMessage = 'Invalid or expired OTP. Please try again.';
      }
    );
  }
}


