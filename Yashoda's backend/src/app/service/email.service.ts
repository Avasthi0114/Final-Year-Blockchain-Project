import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  private complainantEmail: string | null = null;

  setEmail(email: string): void {
    this.complainantEmail = email;
  }

  getEmail(): string | null {
    return this.complainantEmail;
  }
}
