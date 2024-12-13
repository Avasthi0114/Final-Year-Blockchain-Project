import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PdfFormComponent } from './pdf-form/pdf-form.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { PoliceSignUpPageComponent } from './police-sign-up-page/police-sign-up-page.component';
import { PopupComponent } from './popup/popup.component';
import { ComplainantdashboardComponent } from './complainantdashboard/complainantdashboard.component';
 

export const routes: Routes = [
    {
        path: '', component:HomePageComponent
    },
    
    {
        path: 'eFIR', component:FormComponent
    },
    {
        path: 'complainantdash', component: ComplainantdashboardComponent
    },
    {
        path: 'm', component:PdfFormComponent
    },
    {
        path: 'login', component:LoginPageComponent
    },
    {
        path: 'ComplainantSignUp', component:SignUpPageComponent
    },
     
    {
        path: 'PoliceSignUp', component:  PoliceSignUpPageComponent
    },
    {
        path: 'popup', component: PopupComponent
    },
    { path: 'user/form', component: FormComponent }
];
