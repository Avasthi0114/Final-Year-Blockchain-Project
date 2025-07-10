import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  role: string = '';
  constructor() { }

  setRole(data: string){
    this.role = data
  }

  getRole(){
    return this.role;
  }
}
