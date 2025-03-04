import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { EmailService } from '../../service/email.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-complaint',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './manage-complaint.component.html',
  styleUrl: './manage-complaint.component.css'
})
export class ManageComplaintComponent {
  policeId: string | null = null;
  complaints: { ComplaintId: string; Grievance: string; Status: string }[] = [];
  error: string | null = null;

  httpClient = inject(HttpClient);
  httpService = inject(HttpService);
  emailService = inject(EmailService);

  ngOnInit(): void {
    const email = this.emailService.getEmail();
    console.log('Police Email from service in ManageComplaintComponent: ' + email);
  
    if (email) {
      this.fetchPoliceId(email);
    } else {
      this.error = 'No email found in service.';
    }
  }

  // Fetch Police ID based on Email
  fetchPoliceId(email: string): void {
    const url = `http://localhost:8081/user/getPoliceIdByEmail/${email}`;
    this.httpClient.get<{ PoliceOfficerId: string }>(url).subscribe({
      next: (response) => {
        console.log('Response from Police ID API:', response);
        this.policeId = response.PoliceOfficerId; // Update to match API response
        console.log('Police ID fetched:', this.policeId);
        if (this.policeId) {
          this.fetchComplaints(this.policeId);
        }
      },
      error: (err) => {
        console.error('Error fetching Police ID:', err);
        this.error = 'Failed to fetch Police ID.';
      }
    });
  }
  
  
  // Fetch Complaints based on Police ID
  fetchComplaints(policeId: string): void {
    const url = `http://localhost:8081/user/getByPoliceId/${policeId}`;
    this.httpClient.get<any[]>(url).subscribe({
      next: (response) => {
        console.log('Response from Complaints API:', response);
        this.complaints = response;
      },
      error: (err) => {
        console.error('Error fetching complaints:', err);
        this.error = 'Failed to fetch complaint details.';
      }
    });
  }

  viewPartialFIR(complaint: any) {
    const cid = 'Qmf9YGcRhpUKpjavv4a3FSqg9Vv1mZm1PDjkK1Arioz5Yz'; // Ensure CID is available in complaint object

    this.httpService.getFileFromIPFS(cid).subscribe(
      (response: any) => {
          console.log('File fetched successfully:', response); // Log the response
  
          if (response.status === 'success') {
              const fileBufferBase64 = response.fileBuffer;
              const fileType = response.fileType;
  
              const blob = this.base64ToBlob(fileBufferBase64, fileType);
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
          } else {
              console.error('Failed to fetch file:', response);
          }
      },
      (error) => {
          console.error('Error fetching file:', error);
      }
  );
  
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  }

  // Method to handle "Complete FIR"
  completeFIR(complaint: any) {
    const cid = 'Qmf9YGcRhpUKpjavv4a3FSqg9Vv1mZm1PDjkK1Arioz5Yz'; // Ensure CID is available in complaint object

    this.httpService.getFileFromIPFS(cid).subscribe(
      (response: any) => {
          console.log('File fetched successfully:', response); // Log the response
  
          if (response.status === 'success') {
              const fileBufferBase64 = response.fileBuffer;
              const fileType = response.fileType;
  
              const blob = this.base64ToBlob(fileBufferBase64, fileType);
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
          } else {
              console.error('Failed to fetch file:', response);
          }
      },
      (error) => {
          console.error('Error fetching file:', error);
      }
  );
  }

}
