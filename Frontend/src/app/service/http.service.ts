// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { catchError, Observable, tap } from 'rxjs';
// import {environment} from '../../environments/environment';
// import { PoliceLoginResponse } from '../interface/police-login-response';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpService {
//   //10,12
//  // httpClient = inject(HttpClient);
//   // constructor() { }

//   // addInformation(data: any): Observable<any> {
//   //    return this.httpClient.post("http://localhost:3000/information", data); // Sends the form data to json-server

//   //   // return this.httpClient.post("localhost:8081/user/signup", data);
//   // }

//  //new
//  constructor(private httpClient:HttpClient){}
//  url = environment.apiUrl;
//  ipfsurl = environment.ipfsurl

//  private complainantEmail : string | null = null;

//  getComplaintID(): Observable<{ complaintID: string }> {
//   return this.httpClient.get<{ complaintID: string }>('http://localhost:8081/user/complaint-id');
// }


// incrementComplaintID(): Observable<{ complaintID: string }> {
//   return this.httpClient.post<{ complaintID: string }>('http://localhost:8081/user/incrementComplaintId', {});
// }


//  addcomplaint(data: any) {
//   console.log("Data being sent: ", data);
//   return this.httpClient.post(this.url+"/user/addComplaint", data, {
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });  
// }

// // SignUpForm(data:any){
// //     console.log("sign up data being sent:",data);
// //     return this.httpClient.post(this.url+"/user/signup",data,{
// //       headers: new HttpHeaders().set('Content-Type', "application/json")
// //     });
// // }

// SignUpComplaiant(data:any){
//   console.log("sign up data being sent to complaiantdata:",data);
//       return this.httpClient.post(this.url+"/user/SignUpComplainant",data,{
//       headers: new HttpHeaders().set('Content-Type', "application/json")
//     });
// }

// SignUpPolice(data:any){
//   console.log("sign up data being sent to complaiantdata:",data);
//   return this.httpClient.post(this.url+"/user/SignUpPoliceOfficer",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }

// // LoginForm(data:any){
// //   console.log("login data being sent:", data);
// //   return this.httpClient.post(this.url+"/user/login",data,{
// //     headers: new HttpHeaders().set('Content-Type', "application/json")
// //   });
// // }

// LoginComplainant(data:any){
//   console.log("login data being sent:", data);
//   return this.httpClient.post(this.url+"/user/loginComplainant",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }

// // LoginPolice(data:any){
// //   console.log("login data being sent:", data);
// //   return this.httpClient.post(this.url+"/user/loginPolice",data,{
// //     headers: new HttpHeaders().set('Content-Type', "application/json")
// //   });
// // }

// LoginPolice(data:any):Observable<PoliceLoginResponse>{
//   console.log("login data being sent:", data);
//   return this.httpClient.post<PoliceLoginResponse>(this.url+"/user/loginPolice",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }


// generatePDF(data: any){
//   return this.httpClient.post(this.url+ "/user/generatereport",data,{
//     headers: new HttpHeaders().set('Content-Type',"application/json")
//   });
// }

// // getPDF(data: any):Observable<Blob>{
// //   return this.httpClient.post(this.url+"/user/getPdf",data,{responseType: 'blob'});
// // }

// getPDF(data: any): Observable<Blob> {
//   return this.httpClient.post(this.url + "/user/getPdf", data, {
//       responseType: 'blob'  // no need to cast as 'json' here
//   });
// }


// sendEmailBackend(emailData: { complainantEmail: string, UserName: string }): Observable<any> {
//   return this.httpClient.post(this.url + "/user/sendEmail", emailData);
// }


// // getComplainantDetailsByEmail(complainantID: string): Observable<any> {
// //   const url = `${this.apiUrl}/complainant/${complainantID}`;
// //   return this.http.get<any>(url).pipe(
// //     tap(data => console.log('Complainant details response:', data)),
// //     catchError(error => {
// //       console.error('Error fetching complainant details:', error);
// //       throw error;
// //     })
// //   );
// // }

// getComplainantEmail(): string | null {
//   console.log("complainantemail: "+this.complainantEmail);
//   return this.complainantEmail;
//   console.log("complainantemail: "+this.complainantEmail);
// }


// getComplainantDetailsByEmail(complainantEmail: string): Observable<any> {
//   const url = this.url + "complainant/${complainantEmail}";
//   return this.httpClient.get<any>(url).pipe(
//     tap(data => console.log('Complainant details response:', data)),
//     catchError(error => {
//       console.error('Error fetching complainant details:', error);
//       throw error;
//     })
//   );
// }

// uploadToIPFS(): Observable<any> {
//   return this.httpClient.post(`${this.ipfsurl}/uploadToIPFS`, {}, {
//     responseType: 'json' // Default type, expects a JSON response
//   });
// }

// processEvidences(folderCID: string) {
//   return this.httpClient.post(`${this.ipfsurl}/process-evidences`, { folderCID });
// }

// updateFolder(existingFolderCID: string, files: any[]): Observable<any> {
//   const formData = new FormData();
  
//   // Append the existing folder CID to the form data
//   formData.append('existingFolderCID', existingFolderCID);
  
//   // Append each file to the form data
//   files.forEach(file => {
//     // Assuming file.content is a buffer or readable stream, convert it to a Blob
//     const fileBlob = new Blob([file.content], { type: 'application/octet-stream' });
//     formData.append('files', fileBlob, file.path);
//   });

//   // Send the form data to the backend
//   return this.httpClient.post(`${this.ipfsurl}/update-folder`, formData, {
//     responseType: 'json', // Expect a JSON response from the backend
//   });
// }

// }


// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { catchError, Observable, tap } from 'rxjs';
// import {environment} from '../../environments/environment';
// import { PoliceLoginResponse } from '../interface/police-login-response';


// @Injectable({
//   providedIn: 'root'
// })
// export class HttpService {
  //10,12
//  // httpClient = inject(HttpClient);
//   // constructor() { }

//   // addInformation(data: any): Observable<any> {
//   //    return this.httpClient.post("http://localhost:3000/information", data); // Sends the form data to json-server

//   //   // return this.httpClient.post("localhost:8081/user/signup", data);
//   // }

//  //new
//  constructor(private httpClient:HttpClient){}
//  url = environment.apiUrl;
//  ipfsurl = environment.ipfsurl
//  private complainantEmail : string | null = null;

//  getComplaintID(): Observable<{ complaintID: string }> {
//   return this.httpClient.get<{ complaintID: string }>('http://localhost:8081/user/complaint-id');
// }


// incrementComplaintID(): Observable<{ complaintID: string }> {
//   return this.httpClient.post<{ complaintID: string }>('http://localhost:8081/user/incrementComplaintId', {});
// }


//  addcomplaint(data: any) {
//   console.log("Data being sent: ", data);
//   return this.httpClient.post(this.url+"/user/addComplaint", data, {
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });  
// }

// // SignUpForm(data:any){
// //     console.log("sign up data being sent:",data);
// //     return this.httpClient.post(this.url+"/user/signup",data,{
// //       headers: new HttpHeaders().set('Content-Type', "application/json")
// //     });
// // }

// SignUpComplaiant(data:any){
//   console.log("sign up data being sent to complaiantdata:",data);
//       return this.httpClient.post(this.url+"/user/SignUpComplainant",data,{
//       headers: new HttpHeaders().set('Content-Type', "application/json")
//     });
// }

// SignUpPolice(data:any){
//   console.log("sign up data being sent to complaiantdata:",data);
//   return this.httpClient.post(this.url+"/user/SignUpPoliceOfficer",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }

// // LoginForm(data:any){
// //   console.log("login data being sent:", data);
// //   return this.httpClient.post(this.url+"/user/login",data,{
// //     headers: new HttpHeaders().set('Content-Type', "application/json")
// //   });
// // }

// LoginComplainant(data:any){
//   console.log("login data being sent:", data);
//   return this.httpClient.post(this.url+"/user/loginComplainant",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }

// // LoginPolice(data:any){
// //   console.log("login data being sent:", data);
// //   return this.httpClient.post(this.url+"/user/loginPolice",data,{
// //     headers: new HttpHeaders().set('Content-Type', "application/json")
// //   });
// // }

// LoginPolice(data:any):Observable<PoliceLoginResponse>{
//   console.log("login data being sent:", data);
//   return this.httpClient.post<PoliceLoginResponse>(this.url+"/user/loginPolice",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }


// generatePDF(data: any){
//   return this.httpClient.post(this.url+ "/user/generatereport",data,{
//     headers: new HttpHeaders().set('Content-Type',"application/json")
//   });
// }

// // getPDF(data: any):Observable<Blob>{
// //   return this.httpClient.post(this.url+"/user/getPdf",data,{responseType: 'blob'});
// // }

// getPDF(data: any): Observable<Blob> {
//   return this.httpClient.post(this.url + "/user/getPdf", data, {
//       responseType: 'blob'  // no need to cast as 'json' here
//   });
// }


// sendEmailBackend(emailData: { complainantEmail: string, UserName: string }): Observable<any> {
//   return this.httpClient.post(this.url + "/user/sendEmail", emailData);
// }


// // getComplainantDetailsByEmail(complainantID: string): Observable<any> {
// //   const url = `${this.apiUrl}/complainant/${complainantID}`;
// //   return this.http.get<any>(url).pipe(
// //     tap(data => console.log('Complainant details response:', data)),
// //     catchError(error => {
// //       console.error('Error fetching complainant details:', error);
// //       throw error;
// //     })
// //   );
// // }

// getComplainantEmail(): string | null {
//   console.log("complainantemail: "+this.complainantEmail);
//   return this.complainantEmail;
//   console.log("complainantemail: "+this.complainantEmail);
// }


// getComplainantDetailsByEmail(complainantEmail: string): Observable<any> {
//   const url = this.url + "complainant/${complainantEmail}";
//   return this.httpClient.get<any>(url).pipe(
//     tap(data => console.log('Complainant details response:', data)),
//     catchError(error => {
//       console.error('Error fetching complainant details:', error);
//       throw error;
//     })
//   );
// }





// uploadToIPFS(): Observable<any> {
//   return this.httpClient.post(`${this.ipfsurl}/uploadToIPFS`, {}, {
//     responseType: 'json' // Default type, expects a JSON response
//   });
// }

// processEvidences(folderCID: string) {
//   return this.httpClient.post(`${this.ipfsurl}/process-evidences`, { folderCID });
// }

// updateFolder(existingFolderCID: string, files: any[]): Observable<any> {
//   const formData = new FormData();
  
//   // Append the existing folder CID to the form data
//   formData.append('existingFolderCID', existingFolderCID);
  
//   // Append each file to the form data
//   files.forEach(file => {
//     // Assuming file.content is a buffer or readable stream, convert it to a Blob
//     const fileBlob = new Blob([file.content], { type: 'application/octet-stream' });
//     formData.append('files', fileBlob, file.path);
//   });


  
//   // Send the form data to the backend
//   return this.httpClient.post(`${this.ipfsurl}/update-folder`, formData, {
//     responseType: 'json', // Expect a JSON response from the backend
//   });
// }

// }
////////////////////////////////////////////////////////////////

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import {environment} from '../../environments/environment';
import { PoliceLoginResponse } from '../interface/police-login-response';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  //10,12
 // httpClient = inject(HttpClient);
  // constructor() { }

  // addInformation(data: any): Observable<any> {
  //    return this.httpClient.post("http://localhost:3000/information", data); // Sends the form data to json-server

  //   // return this.httpClient.post("localhost:8081/user/signup", data);
  // }

 //new
 constructor(private httpClient:HttpClient){}
 url = environment.apiUrl;
 ipfsurl = environment.ipfsurl
 private complainantEmail : string | null = null;

 getComplaintID(): Observable<{ complaintID: string }> {
  return this.httpClient.get<{ complaintID: string }>('http://localhost:8081/user/complaint-id');
}


incrementComplaintID(): Observable<{ complaintID: string }> {
  return this.httpClient.post<{ complaintID: string }>('http://localhost:8081/user/incrementComplaintId', {});
}


 addcomplaint(data: any) {
  console.log("Data being sent: ", data);
  return this.httpClient.post(this.url+"/user/addComplaint", data, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });  
}

// SignUpForm(data:any){
//     console.log("sign up data being sent:",data);
//     return this.httpClient.post(this.url+"/user/signup",data,{
//       headers: new HttpHeaders().set('Content-Type', "application/json")
//     });
// }

SignUpComplaiant(data:any){
  console.log("sign up data being sent to complaiantdata:",data);
      return this.httpClient.post(this.url+"/user/SignUpComplainant",data,{
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
}

SignUpPolice(data:any){
  console.log("sign up data being sent to complaiantdata:",data);
  return this.httpClient.post(this.url+"/user/SignUpPoliceOfficer",data,{
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}

// LoginForm(data:any){
//   console.log("login data being sent:", data);
//   return this.httpClient.post(this.url+"/user/login",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }

LoginComplainant(data:any){
  console.log("login data being sent:", data);
  return this.httpClient.post(this.url+"/user/loginComplainant",data,{
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}

// LoginPolice(data:any){
//   console.log("login data being sent:", data);
//   return this.httpClient.post(this.url+"/user/loginPolice",data,{
//     headers: new HttpHeaders().set('Content-Type', "application/json")
//   });
// }

LoginPolice(data:any):Observable<PoliceLoginResponse>{
  console.log("login data being sent:", data);
  return this.httpClient.post<PoliceLoginResponse>(this.url+"/user/loginPolice",data,{
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}


generatePDF(data: any){
  return this.httpClient.post(this.url+ "/user/generatereport",data,{
    headers: new HttpHeaders().set('Content-Type',"application/json")
  });
}

// getPDF(data: any):Observable<Blob>{
//   return this.httpClient.post(this.url+"/user/getPdf",data,{responseType: 'blob'});
// }

getPDF(data: any): Observable<Blob> {
  return this.httpClient.post(this.url + "/user/getPdf", data, {
      responseType: 'blob'  // no need to cast as 'json' here
  });
}


sendEmailBackend(emailData: { complainantEmail: string, UserName: string }): Observable<any> {
  return this.httpClient.post(this.url + "/user/sendEmail", emailData);
}


// getComplainantDetailsByEmail(complainantID: string): Observable<any> {
//   const url = `${this.apiUrl}/complainant/${complainantID}`;
//   return this.http.get<any>(url).pipe(
//     tap(data => console.log('Complainant details response:', data)),
//     catchError(error => {
//       console.error('Error fetching complainant details:', error);
//       throw error;
//     })
//   );
// }

getComplainantEmail(): string | null {
  console.log("complainantemail: "+this.complainantEmail);
  return this.complainantEmail;
  console.log("complainantemail: "+this.complainantEmail);
}


getComplainantDetailsByEmail(complainantEmail: string): Observable<any> {
  const url = this.url + "complainant/${complainantEmail}";
  return this.httpClient.get<any>(url).pipe(
    tap(data => console.log('Complainant details response:', data)),
    catchError(error => {
      console.error('Error fetching complainant details:', error);
      throw error;
    })
  );
}



getOfficers(): Observable<any[]> {
  return this.httpClient.get<any[]>('http://localhost:8081/user/policedata');
}

getComplaints(): Observable<any[]> {
  return this.httpClient.get<any[]>('http://localhost:8081/user/complaints');
}

assignPolice(requestBody: { ComplaintId: string; PoliceId: string }): Observable<any> {
  return this.httpClient.post(`http://localhost:8081/user/assignPolice`,requestBody);
}

uploadToIPFS(): Observable<any> {
  return this.httpClient.post(`${this.ipfsurl}/uploadToIPFS`, {}, {
    responseType: 'json' // Default type, expects a JSON response
  });
}

processEvidences(folderCID: string) {
  return this.httpClient.post(`${this.ipfsurl}/process-evidences`, { folderCID });
}

updateFolder(existingFolderCID: string, files: any[]): Observable<any> {
  const formData = new FormData();
  
  // Append the existing folder CID to the form data
  formData.append('existingFolderCID', existingFolderCID);
  
  // Append each file to the form data
  files.forEach(file => {
    // Assuming file.content is a buffer or readable stream, convert it to a Blob
    const fileBlob = new Blob([file.content], { type: 'application/octet-stream' });
    formData.append('files', fileBlob, file.path);
  });

  // Send the form data to the backend
  return this.httpClient.post(`${this.ipfsurl}/update-folder`, formData, {
    responseType: 'json', // Expect a JSON response from the backend
  });
}

getFileFromIPFS(hash: string): Observable<any> {
  return this.httpClient.get(`${this.ipfsurl}/get-file/${hash}`, {
    responseType: 'json'
  });
}

}




 


 



