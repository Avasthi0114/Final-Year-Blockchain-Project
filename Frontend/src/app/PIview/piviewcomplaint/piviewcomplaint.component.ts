import { Component, inject } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-piviewcomplaint',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './piviewcomplaint.component.html',
  styleUrl: './piviewcomplaint.component.css'
})
export class PiviewcomplaintComponent {


 complaints: any[] = [];
  errorMessage: string = '';
 router = inject(Router);
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.fetchComplaints();
  }

  fetchComplaints(): void {
    this.httpService.getComplaints().subscribe(
      (data: any[]) => {
        // console.log('Officers data:', data);  // Log the fetched data
        this.complaints = data;
      },
      (error: any) => {
        this.errorMessage = 'Error fetching officer data.';
        console.error(error);
      }
    );
  }

  // assignPolice(complaintId: string): void {
    
  //   this.router.navigate(['/assignpolice']);
  //   console.log(`Assigning police to complaint ID: ${complaintId}`);
  //   // Call your backend API to update the status or assign an officer
  //   this.httpService.assignPolice(complaintId).subscribe(
  //     (response: any) => {
  //       // Update the complaint status to assigned
  //       this.fetchComplaints(); // Refetch the complaints after the update
  //     },
  //     (error: any) => {
  //       console.error('Error assigning police:', error);
  //     }
  //   );
  // }
  
  assignPolice(complaintId: string, grievance: string, placeOfOccurance: string): void {
    // Navigate to the AssignPoliceComponent and pass the data via query parameters
    this.router.navigate(['/assignpolice'], {
      queryParams: { 
        complaintId: complaintId,
        grievance: grievance,
        placeOfOccurance: placeOfOccurance 
      }
    });
    this.fetchComplaints();
  }
  
}
