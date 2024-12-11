import { Component , Input, Output, EventEmitter} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginPageComponent } from '../login-page/login-page.component';
import { SharedServiceService } from '../shared/shared-service.service';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink ],
   templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  
  role: string = 'a';
  @Output() roleEvent = new EventEmitter<string>();

  constructor(private shared: SharedServiceService) {}

   navigateToLogin(EnteredRole: string)  {
     this.role = EnteredRole;
    //  console.log("ROLE: "+this.role);
     this.shared.setRole(this.role);
    console.log("sharing role" +EnteredRole);
  }

  // sendRole(){
  //   this.roleEvent.emit(this.role);
  //   console.log("sending role"+this.role);
  // }
}
