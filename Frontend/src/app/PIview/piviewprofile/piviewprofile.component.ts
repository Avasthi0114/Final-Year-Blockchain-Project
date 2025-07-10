import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { EmailService } from '../../service/email.service';
import { DatePipe } from '@angular/common';
import { catchError, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-piviewprofile',
  standalone: true,
 imports: [RouterLink, ReactiveFormsModule],
 providers: [DatePipe],
  templateUrl: './piviewprofile.component.html',
  styleUrl: './piviewprofile.component.css'
})
export class PIviewprofileComponent {
PoliceID: any;
  editdata: any;
  closemessage = 'closed using directive';
  hide = true;
  httpClient = inject(HttpClient);
  httpService = inject(HttpService);
  emailService = inject(EmailService);

  constructor(private buildr: FormBuilder, private datePipe: DatePipe) {}

  // Inject EmailService

  ngOnInit(): void {
    this.PoliceID = this.emailService.getEmail();
    console.log('Police ID from service: ' + this.PoliceID);

    if (this.PoliceID) {
      this.getPoliceDetailsByEmail(this.PoliceID).subscribe((data) => {
        this.setData(data);
      });
    }
  }

  myform = this.buildr.group({
    Name: this.buildr.control(''),
    Email: this.buildr.control(''),
    PhoneNumber: this.buildr.control(''),
    PoliceOfficerRank: this.buildr.control(''),
    PoliceOfficerId: this.buildr.control(''),
    PoliceStationId: this.buildr.control(''),
    password: this.buildr.control(''),
  });

  getPoliceDetailsByEmail(policeEmail: string): Observable<any> {
    // Use backticks (`) for string interpolation
    const url = `http://localhost:8081/user/police/${policeEmail}`;

    return this.httpClient.get<any>(url).pipe(
      tap((data) => console.log('Complainant details response:', data)),
      catchError((error) => {
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
      PoliceOfficerRank: data.PoliceOfficerRank,
      PoliceOfficerId: data.PoliceOfficerId,
      PoliceStationId: data.PoliceStationId,
      password: data.password,
    });
  }
  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide = !this.hide;
  }
}
