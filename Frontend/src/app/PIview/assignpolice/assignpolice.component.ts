import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-assignpolice',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './assignpolice.component.html',
  styleUrl: './assignpolice.component.css'
})
export class AssignpoliceComponent {
  complaintId: string = '';
  grievance: string = '';
  placeOfOccurance: string = '';
  policeId: string = '';
  httpService =inject(HttpService) ;
 router = inject(Router);
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Retrieve query parameters
    this.route.queryParams.subscribe(params => {
      this.complaintId = params['complaintId'];
      this.grievance = params['grievance'];
      this.placeOfOccurance = params['placeOfOccurance'];
    });
  }

//   assignPolice(): void {
//   // Make the HTTP call to update the status to "Assigned"
//   this.httpService.assignPolice(this.complaintId).subscribe(
//     (response: any) => {
//       console.log('Complaint assigned:', response);
//       // After successfully assigning the complaint, navigate back to the complaints list
//       this.router.navigate(['/piviewcomplaints']);
//     },
//     (error: any) => {
//       console.error('Error assigning complaint:', error);
//     }
//   );
// }

assignPolice(): void {
  // Prepare request body with both ComplaintId and PoliceId
  const requestBody = {
    ComplaintId: this.complaintId,
    PoliceId: this.policeId
  };

  // Send the data to the backend to update the database
  this.httpService.assignPolice(requestBody).subscribe(
    (response: any) => {
      console.log('Police assigned:', response);
      // Navigate back to the complaint list or wherever you want
      this.router.navigate(['/piviewcomplaints']);
    },
    (error: any) => {
      console.error('Error assigning police:', error);
    }
  );
}

}
