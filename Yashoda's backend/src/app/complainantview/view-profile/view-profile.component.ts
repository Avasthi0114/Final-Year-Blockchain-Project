import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { catchError, Observable, tap } from 'rxjs';
import { EmailService } from '../../service/email.service';


@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {
  complainantID: any;
  editdata: any;
  closemessage = 'closed using directive';
  hide = true;
  httpClient = inject(HttpClient)
  httpService = inject(HttpService); 
  emailService = inject(EmailService);

  constructor( 
    private buildr: FormBuilder ,
    private datePipe: DatePipe
    ) {
  
  }

     // Inject EmailService

  ngOnInit(): void {
    this.complainantID = this.emailService.getEmail();
    console.log('Complainant ID from service: ' + this.complainantID);

    if (this.complainantID) {
      this.getComplainantDetailsByEmail(this.complainantID).subscribe(data => {
        this.setData(data);
      });
    }
  }

  myform = this.buildr.group({
    Name: this.buildr.control(''),
    Email: this.buildr.control(''),
    PhoneNumber: this.buildr.control(''),
    password: this.buildr.control('')
  });

  getComplainantDetailsByEmail(complainantEmail: string): Observable<any> {
    // Use backticks (`) for string interpolation
    const url = `http://localhost:8081/user/complainant/${complainantEmail}`;
    
    return this.httpClient.get<any>(url).pipe(
      tap(data => console.log('Complainant details response:', data)),
      catchError(error => {
        console.error('Error fetching complainant details:', error);
        throw error;
      })
    );
  }
  

  setData(data: any) {
    this.myform.setValue({
      Name: data.Name,
      Email: data.Email,
      PhoneNumber: data.PhoneNumber,
      password: data.password
    });
  }
  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide = !this.hide;
  } 

}
