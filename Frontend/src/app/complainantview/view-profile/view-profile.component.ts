import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';


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

  constructor( 
    private buildr: FormBuilder ,
    private datePipe: DatePipe
    ) {
  
  }

  ngOnInit(): void {
    // this.inputdata = this.data;
    this.complainantID = this.httpService.getComplainantEmail();
    console.log('complainant Id:' + this.complainantID);
    if (this.complainantID) {
      this.setdata(this.complainantID);
    }
  }

 

  myform = this.buildr.group({
    name: this.buildr.control(''),
    email: this.buildr.control(''),
    dob: this.buildr.control(''),
    password: this.buildr.control('')
  });

 
  setdata(code: any) {
    this.httpService.getComplainantDetailsByEmail(code).subscribe(
      (items: any) => {
        console.log('API Response:', items);
        this.editdata = items;
        console.log('editdata before setting form values:', this.editdata);
        const item = items[0];
        console.log('item' + item);
        if (item && item.name && item.email && item.password && item.dob) {
          this.editdata = item;

          // Log the properties individually to check their values
          console.log('Name:', this.editdata.name);
          console.log('Email:', this.editdata.email);
          console.log('Password:', this.editdata.password);
          console.log('DOB:', this.editdata.dob);

          // const formattedDob = this.datePipe.transform(this.editdata.dob, 'dd/MM/yyyy');
          //  console.log('Formatted Date:', formattedDob);
          const parsedDob = new Date(this.editdata.dob);

          // Check if parsedDob is a valid date
          if (!isNaN(parsedDob.getTime())) {
            const formattedDob = this.datePipe.transform(this.editdata.dob, 'dd/MM/yyyy');
            console.log('Formatted Date:', formattedDob);
            // Set form values
            this.myform.setValue({
              name: this.editdata.name,
              email: this.editdata.email,
              password: this.editdata.password,
              dob: this.editdata.dob
            });
          }
        } else {
          console.error('Invalid or missing data in API response:', item);
        }
      },
      (error) => {
        console.error('Error fetching complainant details:', error);
      }
    );
  }

  

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide = !this.hide;
  } 

}
