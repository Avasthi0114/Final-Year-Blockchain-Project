import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

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

 ipfsurl = environment.ipfsurl;

 addInformation(data: any) {
  console.log("Data being sent: ", data);
  return this.httpClient.post(this.url+"/user/form", data, {
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

LoginPolice(data:any){
  console.log("login data being sent:", data);
  return this.httpClient.post(this.url+"/user/loginPolice",data,{
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


uploadToIPFS(): Observable<any> {
  return this.httpClient.post(`${this.ipfsurl}/uploadToIPFS`, {}, {
    responseType: 'json' // Default type, expects a JSON response
  });
}
 

}
 