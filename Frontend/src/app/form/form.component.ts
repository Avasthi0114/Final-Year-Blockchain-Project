import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../service/http.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 
import { Router, RouterLink } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver'; //For saving pdf
import { response } from 'express';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EmailService } from '../service/email.service';

export function occurrenceDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromDate = group.get('OccurenceDateFrom')?.value;
    const toDate = group.get('OccurenceDateTo')?.value;

    if (!fromDate || !toDate) {
      return null; // Skip validation if either date is missing
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Check if dates are valid
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return null; // Skip validation if dates are invalid
    }

    // Validate conditions
    if (to < from || to > today) {
      return { invalidOccurrenceDate: true }; // Validation fails
    }

    return null; // Validation passes
  };
}


export function dateBeforeTodayValidator(control: AbstractControl): ValidationErrors | null {
  const today = new Date();
  const enteredDate = new Date(control.value);

  // If the date is invalid or after today, return an error
  if (!isNaN(enteredDate.getTime()) && enteredDate >= today) {
    return { dateNotValid: true }; // Custom error object
  }
  return null; // Valid date
}

export function dateAfterTodayValidator(control: AbstractControl): ValidationErrors | null {
  const today = new Date();
  const enteredDate = new Date(control.value);

  // If the date is invalid or after today, return an error
  if (!isNaN(enteredDate.getTime()) && enteredDate > today) {
    return { dateNotValid: true }; // Custom error object
  }
  return null; // Valid date
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgxUiLoaderModule, RouterLink], 
   providers: [DatePipe],  
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']   
})

export class FormComponent {
  httpClient = inject(HttpClient)
  httpService = inject(HttpService); 
  emailService = inject(EmailService);
  router = inject(Router);
  isSuccess : boolean = false;
  responseMessage:any;
  complainantEmail: any;
 
  selectedFile: File | null = null;

  constructor(private ngxService: NgxUiLoaderService, private fb: FormBuilder, private http: HttpClient, private datePipe: DatePipe) {
    
  }

  
  complainantForm = new FormGroup({
    ComplaintID: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]*$')
    ]),

      UserName: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')

      ]),
      FatherOrHusbandName: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')

      ]),
      DateOfBirth: new FormControl('',[
        Validators.required,
        dateBeforeTodayValidator
      ]),
      complainantemail: new FormControl('',[
        Validators.required, 
        ]),  
      Nationality: new FormControl('Indian',[
        Validators.required,
        Validators.pattern('^[a-zA-Z]*$')
      ]),
      PhoneNumber: new FormControl('',[
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$') // Only numbers allowed 
        ]), 
      PermanentAddress: new FormControl('',[
        Validators.required
      ]),
      TemporaryAddress: new FormControl('',[
        Validators.required
      ]),
      UIDNo: new FormControl('',[
        Validators.required,
        Validators.pattern(/^\d{12}$/) // Regular expression for exactly 12 digits
      ]),
      PassportNo: new FormControl(''),
      DateOfIssue: new FormControl('',[
        dateAfterTodayValidator
      ]),
      PlaceOfIssue: new FormControl(''),
      IDType: new FormControl('',[
        Validators.required
      ]),
      IDNumber: new FormControl('',[
        Validators.required
      ]),
      Occupation: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')
      ]),

    
      PropertyCategory: new FormControl(''),
      PropertyType: new FormControl(''),
      DescriptionOfProperty: new FormControl(''),
      TotleValueOfProperty: new FormControl(''),
      ValueOfProperty: new FormControl(''),
      OccurenceDay: new FormControl('',[
        dateAfterTodayValidator
      ]),
      OccurenceDateFrom: new FormControl('',[
        dateAfterTodayValidator
      ]),
      OccurenceDateTo: new FormControl('',[
        dateAfterTodayValidator,
        
      ]),
      OccurenceTimePeriod: new FormControl(''),
      OccurenceTimeFrom: new FormControl(''),
      OccurenceTimeTo: new FormControl(''),
      OccurenceDate: new FormControl('',[
        dateAfterTodayValidator
      ]),
      OccurenceTime: new FormControl(''),
      Occurence: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')

      ]),
      Accused: new FormControl(''),
      FirstInformationcontent: new FormControl(''),
      ReasonOfDelay: new FormControl('')  ,
      GrievenceTitle: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')

      ]),
      file: new FormControl('')
  }, { validators: occurrenceDateValidator() });

  ComplaintID: string = '';
  ngOnInit() {

    // Fetch the complainant ID from the backend
    this.httpService.getComplaintID().subscribe(
      (response: any) => {
        this.ComplaintID = response.complaintID;
        console.log('Current Complaint ID:', this.ComplaintID);
         // Set the ComplaintID in the form
        this.complainantForm.get('ComplaintID')?.setValue(this.ComplaintID);
      },
      (error) => {
        console.error('Error fetching complaint ID:', error);
      }
    );

    this.complainantEmail = this.emailService.getEmail();
    console.log('Complainant ID from service: ' + this.complainantEmail);

    
  }

  isFieldInvalid(field: string): boolean {
    const control = this.complainantForm.get(field);
    return !!(control?.invalid && ((control?.touched ?? false) || (control?.dirty ?? false)));
  }
  
  isFieldTouched(field: string): boolean {
    const control = this.complainantForm.get(field);
    return (control?.touched ?? false) || (control?.dirty ?? false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

 submitAction() {
  // Start the loader
  this.ngxService.start();

  // If the form is invalid, mark all fields as touched to show validation errors and stop execution
  if (this.complainantForm.invalid) {
    this.complainantForm.markAllAsTouched();
    this.ngxService.stop();
    this.responseMessage = 'Form submission failed. Please check all required fields.';
    this.isSuccess = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      this.isSuccess = false; // Hide success message
      this.responseMessage = ''; // Clear message
    }, 5000); // 5000 milliseconds = 5 seconds

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return; // Stop further execution
  }

  // Get form data
  const formData = this.complainantForm.value;
  const data = {
    ComplaintID: formData.ComplaintID,
    UserName: formData.UserName,
    FatherOrHusbandName: formData.FatherOrHusbandName, 
    DateOfBirth: formData.DateOfBirth,
    Nationality: formData.Nationality,
    PermanentAddress: formData.PermanentAddress,
    TemporaryAddress: formData.TemporaryAddress,
    UIDNo: formData.UIDNo,
    PassportNo: formData.PassportNo || null,
    DateOfIssue: formData.DateOfIssue || null,
    PlaceOfIssue: formData.PlaceOfIssue || null,
    IDType: formData.IDType,
    IDNumber: formData.IDNumber,
    Occupation: formData.Occupation,
    PropertyCategory: formData.PropertyCategory || null,
    PropertyType: formData.PropertyType || null,
    DescriptionOfProperty: formData.DescriptionOfProperty || null,
    TotleValueOfProperty: formData.TotleValueOfProperty || null,
    ValueOfProperty: formData.ValueOfProperty || null,
    OccurenceDay: formData.OccurenceDay || null,
    OccurenceDateFrom: formData.OccurenceDateFrom || null,
    OccurenceDateTo: formData.OccurenceDateTo || null,
    OccurenceTimePeriod: formData.OccurenceTimePeriod || null,
    OccurenceTimeFrom: formData.OccurenceTimeFrom || null,
    OccurenceTimeTo: formData.OccurenceTimeTo || null,
    OccurenceDate: formData.OccurenceDate || null,
    OccurenceTime: formData.OccurenceTime || null,
    Occurence: formData.Occurence || null,
    Accused: formData.Accused || null,
    FirstInformationcontent: formData.FirstInformationcontent || null,
    ReasonOfDelay: formData.ReasonOfDelay || null,
    complainantemail: formData.complainantemail,
    PhoneNumber: formData.PhoneNumber,
    GrievenceTitle: formData.GrievenceTitle
  };


  // Method to add a complaint

  const complaintdata = {
    ComplaintId: formData.ComplaintID,
    PlaceOfOccurance: formData.Occurence ,
    Grievance: formData.GrievenceTitle,
    Email: this.complainantEmail
  }
   
  this.httpService.addcomplaint(complaintdata).subscribe(
    (response: any) => {
      console.log('Complaint added successfully:', response);
      
    },
    (error: any) => {
       
      console.error('Error adding complaint:', error);
    }
  );


  // Generate PDF and handle response
  this.httpService.generatePDF(data).subscribe(
    (response: any) => {
      if (response?.uuid) {
        this.downloadPdf(response.uuid);
    //     this.complainantForm.reset();
    //   } else {
    //     console.error("PDF generation failed.");
    //   }

    // },
         // Step 2: Send email
         this.httpService.addcomplaint(complaintdata);
         if (data.complainantemail) {
          this.httpService.sendEmailBackend({
            complainantEmail: data.complainantemail,
            UserName: data.UserName as string,
          }).subscribe(
            (emailResponse) => {
              console.log('Email sent successfully!', emailResponse);
            },
            (emailError) => {
              console.error('Error sending email:', emailError);
            }
          );
        } else {
          console.error('Complainant email is missing.');
        }

        this.httpService.incrementComplaintID().subscribe(
          (complaintIDResponse: any) => {
            this.ComplaintID = complaintIDResponse.complaintID;  // Update the complaint ID after increment
            console.log('Complaint ID incremented successfully:', this.ComplaintID);
          },
          (error: { message: string; }) => {
            console.error('Error incrementing complainant ID:', error);
            // this.responseMessage = 'Error incrementing complaint ID: ' + error.message;
          }
        );
  

        // Reset the form after success
        this.complainantForm.reset();
        this.responseMessage = 'Form submitted successfully! An email will be sent to you. Please check your inbox.';
        this.isSuccess = true;

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          this.isSuccess = false; // Hide success message
          this.responseMessage = ''; // Clear message
        }, 5000); // 5000 milliseconds = 5 seconds
  
         
      } else {
        console.error('PDF generation failed.');
      }
    },
    (error: any) => {
      this.responseMessage = error.error?.message || "Error generating PDF.";
    }

    
  );

  // Submit form data to add information
  // this.httpService.addInformation(data).subscribe(
  //   (response) => {
  //     console.log('Form submitted successfully!', response);

  //     // Reset the form only after a successful submission
  //     this.complainantForm.reset();
  //     this.ngxService.stop(); // Stop the loader after success
  //   },
  //   (error) => {
  //     console.error('Error occurred:', error);
  //     this.ngxService.stop(); // Stop the loader on error
  //   }
  // );

  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8081/user/upload', formData).subscribe(
      (response) => {
        console.log('File uploaded successfully:', response);
      },
      (error) => {
        console.error('File upload failed:', error);
      }
    );
  }


  
}


downloadPdf(uuid: string) {
    const data = { uuid };
    this.httpService.getPDF(data).subscribe((response: Blob) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `${uuid}.pdf`;
        a.click();
        URL.revokeObjectURL(fileURL);  // Clean up after download
        this.ngxService.stop();
    }, (error: any) => {
        this.ngxService.stop();
        console.error("Error downloading PDF:", error);
    });
}
   
}
