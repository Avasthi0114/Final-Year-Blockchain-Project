import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { EmailService } from '../../service/email.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-complaints',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  providers: [DatePipe],
  templateUrl: './view-complaints.component.html',
  styleUrl: './view-complaints.component.css'
})
export class ViewComplaintsComponent {
 complainantID: any;
 complaints: { ComplaintId: string; Grievance: string  }[] = [];
  editdata: any;
  closemessage = 'closed using directive';
  error: string | null = null;

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
      this.fetchComplaints();
    }
  }

  // fetchComplaints(): void {
  //   this.httpService.getComplaintDetailsByEmail(this.complainantID).subscribe({
  //     next: (response) => {
  //       this.complaints = response;
  //       console.log('Complaint details fetched:', this.complaints);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching complaints:', err);
  //       this.error = 'Failed to fetch complaint details.';
  //     }
  //   });
  // }

  fetchComplaints(): void {
    const url = `http://localhost:8081/user/complaints/${this.complainantID}`;
    this.httpClient.get<any[]>(url).subscribe({
      next: (response) => {
        this.complaints = response;
        console.log('Complaint details fetched:', this.complaints);
      },
      error: (err) => {
        console.error('Error fetching complaints:', err);
        this.error = 'Failed to fetch complaint details.';
      }
    });
  }

}
