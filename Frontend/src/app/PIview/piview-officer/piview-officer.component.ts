import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../service/http.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-piview-officer',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './piview-officer.component.html',
  styleUrl: './piview-officer.component.css'
})
export class PIviewOfficerComponent {
  officers: any[] = [];
  errorMessage: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.fetchOfficers();
  }

  fetchOfficers(): void {
    this.httpService.getOfficers().subscribe(
      (data: any[]) => {
        // console.log('Officers data:', data);  // Log the fetched data
        this.officers = data;
      },
      (error: any) => {
        this.errorMessage = 'Error fetching officer data.';
        console.error(error);
      }
    );
  }
  
  
}
