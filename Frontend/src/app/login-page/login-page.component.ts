import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { SignUpPageComponent } from '../sign-up-page/sign-up-page.component';
import { HttpService } from '../service/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../shared/shared-service.service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  role: string = 'aaaa'; // Store the role
  errorMessage: string = '';
  httpService = inject(HttpService);
  router = inject(Router);

  constructor(
    private ngxService: NgxUiLoaderService,
    private shared: SharedServiceService
  ) {}

  ngOnInit(): void {
    this.role = this.shared.getRole();
  }

  LoginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]), // Added email validator
    password: new FormControl('',  [Validators.required, ]),
  });

  login() {
    if (this.role == 'citizen') {
      this.ComplainantLogin();
    } else if (this.role == 'police') {
      this.PoliceLogin();
    }
  }

  navigateToSignUp(): void {
    if (this.role === 'citizen') {
      console.log('complaiant signup');
      this.router.navigate(['/ComplainantSignUp']); // Navigate to complainant signup
    } else if (this.role === 'police') {
      console.log('police signup');
      this.router.navigate(['/PoliceSignUp']); // Navigate to police signup
    } else {
      console.warn('No role selected for sign up');
    }
  }

  ComplainantLogin() {
    console.log('complainant login');
    if (this.LoginForm.valid) {
      console.log('Successfully logged in');
      this.ngxService.start(); // Show loader during login

      const LoginFormData = this.LoginForm.value;
      const data = {
        Email: LoginFormData.Email,
        password: LoginFormData.password,
      };

      this.httpService.LoginComplainant(data).subscribe(
        (response) => {
          console.log('Received role: ' + this.role);
          console.log('Login successful!', response);
          this.LoginForm.reset();
          this.errorMessage = ''; // Clear any previous error messages
          this.ngxService.stop();
          this.router.navigate(['/complainantdash']);
        },
        (error) => {
          this.ngxService.stop();
          if (error.status === 401) {
            console.log('Incorrect username or password');
            this.errorMessage = 'Incorrect username or password'; // Set the error message
          }else if (error.status === 402) {
            console.log('Invalid password');
            this.errorMessage = 'Incorrect username or password'; // Set the error message
          } else {
            this.errorMessage = ' Incorrect Username or Password'; // Set the error message
            console.error('Error occurred:', error);
          }
        }
      );
    } else {
      this.LoginForm.markAllAsTouched();
      console.warn('Form is invalid');
    }
  }

  PoliceLogin() {
    console.log('police login');
    if (this.LoginForm.valid) {
      console.log('Successfully logged in');
      this.ngxService.start(); // Show loader during login

      const LoginFormData = this.LoginForm.value;
      const data = {
        Email: LoginFormData.Email,
        password: LoginFormData.password,
      };

      this.httpService.LoginPolice(data).subscribe(
        (response) => {
          console.log('Received role: ' + this.role);
          console.log('Login successful!', response);
          this.LoginForm.reset();
          this.errorMessage = ''; // Clear any previous error messages
          this.ngxService.stop();
          this.router.navigate(['/policedash']);
        },
        (error) => {
          this.ngxService.stop();
          if (error.status === 401) {
            console.log('Incorrect username or password');
            this.errorMessage = 'Incorrect username or password'; // Set the error message
          }else if (error.status === 402) {
            console.log('Invalid password');
            this.errorMessage = 'Incorrect username or password'; // Set the error message
          } else {
            this.errorMessage = ' Incorrect Username or Password'; // Set the error message
            console.error('Error occurred:', error);
          }
        }
      );
    } else {
      this.LoginForm.markAllAsTouched();
      console.warn('Form is invalid');
    }
  }

  // if (this.LoginForm.valid) {
  //   console.log(`Logging in as ${this.role}`);
  //   if (this.role === 'citizen') {
  //     this.citizenLogin();
  //   } else if (this.role === 'police') {
  //     this.policeLogin();
  //   }
  // } else {
  //   this.LoginForm.markAllAsTouched();
  // }

  // citizenLogin(): void {
  //   console.log('Citizen login logic here');
  //   // Add citizen login API logic
  //   this.router.navigate(['/login']); // Example redirection
  // }

  // policeLogin(): void {
  //   console.log('Police login logic here');
  //   // Add police login API logic
  //   this.router.navigate(['/login']); // Example redirection
  // }

  // navigateToSignUp(): void {
  //   if (this.role === 'citizen') {
  //     this.router.navigate(['/ComplainantSignUp']);
  //   } else if (this.role === 'police') {
  //     this.router.navigate(['/PoliceSignUp']);
  //   }
}
