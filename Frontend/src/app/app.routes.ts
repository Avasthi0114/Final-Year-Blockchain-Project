// import { Routes } from '@angular/router';
// import { FormComponent } from './form/form.component';
// import { HomePageComponent } from './home-page/home-page.component';
// import { PdfFormComponent } from './pdf-form/pdf-form.component';
// import { LoginPageComponent } from './login-page/login-page.component';
// import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
// import { PoliceSignUpPageComponent } from './police-sign-up-page/police-sign-up-page.component';
// import { PopupComponent } from './popup/popup.component';
// import { ComplainantdashboardComponent } from './complainantview/complainantdashboard/complainantdashboard.component';
// import { ViewProfileComponent } from './complainantview/view-profile/view-profile.component';
// import { PolicedashComponent } from './policetview/policedash/policedash.component';
// import { PoliceViewprofileComponent } from './policetview/police-viewprofile/police-viewprofile.component';
// import { ManageComplaintComponent } from './policetview/manage-complaint/manage-complaint.component';
// import { PoliceFIRFormComponent } from './policetview/police-fir-form/police-fir-form.component';
// import { ViewComplaintsComponent } from './complainantview/view-complaints/view-complaints.component';
 
 

// export const routes: Routes = [
//     {
//         path: '', component:HomePageComponent
//     },
    
//     {
//         path: 'eFIR', component:FormComponent
//     },
//     {
//         path: 'complainantdash', component:  ComplainantdashboardComponent
//     },
//     {
//         path: 'viewprofile', component:  ViewProfileComponent
//     },
//     {
//         path: 'viewcomplaint', component:    ViewComplaintsComponent
//     },
//     {
//         path: 'policedash', component:  PolicedashComponent
//     },
//     {
//         path: 'policeviewprofile', component:  PoliceViewprofileComponent
//     },
//     {
//         path: 'm', component:PdfFormComponent
//     },
//     {
//         path: 'login', component:LoginPageComponent
//     },
//     {
//         path: 'ComplainantSignUp', component:SignUpPageComponent
//     },
     
//     {
//         path: 'PoliceSignUp', component:  PoliceSignUpPageComponent
//     },
//     {
//         path: 'manageComplaint', component:  ManageComplaintComponent
//     },
//     {
//         path: 'policeFIRform', component:  PoliceFIRFormComponent
//     },
//     {
//         path: 'popup', component: PopupComponent
//     },
//     { path: 'user/form', component: FormComponent }
// ];


import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PdfFormComponent } from './pdf-form/pdf-form.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { PoliceSignUpPageComponent } from './police-sign-up-page/police-sign-up-page.component';
import { PopupComponent } from './popup/popup.component';
import { ComplainantdashboardComponent } from './complainantview/complainantdashboard/complainantdashboard.component';
import { ViewProfileComponent } from './complainantview/view-profile/view-profile.component';
import { PolicedashComponent } from './policetview/policedash/policedash.component';
import { PoliceViewprofileComponent } from './policetview/police-viewprofile/police-viewprofile.component';
import { ManageComplaintComponent } from './policetview/manage-complaint/manage-complaint.component';
import { PoliceFIRFormComponent } from './policetview/police-fir-form/police-fir-form.component';
import { ViewComplaintsComponent } from './complainantview/view-complaints/view-complaints.component';
import { PIdashboardComponent } from './PIview/pidashboard/pidashboard.component';
import { PIviewOfficerComponent } from './PIview/piview-officer/piview-officer.component';
import { PiviewcomplaintComponent } from './PIview/piviewcomplaint/piviewcomplaint.component';
import { AssignpoliceComponent } from './PIview/assignpolice/assignpolice.component';
import { PIviewprofileComponent } from './PIview/piviewprofile/piviewprofile.component';



 

export const routes: Routes = [
    {
        path: '', component:HomePageComponent
    },
    
    {
        path: 'eFIR', component:FormComponent
    },
    {
        path: 'complainantdash', component:  ComplainantdashboardComponent
    },
    {
        path: 'viewprofile', component:  ViewProfileComponent
    },
    {
        path: 'viewcomplaint', component:    ViewComplaintsComponent
    },
    {
        path: 'policedash', component:  PolicedashComponent
    },
    {
        path: 'policeviewprofile', component:  PoliceViewprofileComponent
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
        path: 'manageComplaint', component:  ManageComplaintComponent
    },
    {
        path: 'policeFIRform', component:  PoliceFIRFormComponent
    },
    {
        path: 'popup', component: PopupComponent
    },
    { path: 'user/form', component: FormComponent },

    {
        path: 'pidashboard', component: PIdashboardComponent
    },
    {
        path: 'piviewofficer', component: PIviewOfficerComponent
    },
    {
        path: 'piviewcomplaints', component: PiviewcomplaintComponent
    },
    {
        path: 'assignpolice', component: AssignpoliceComponent
    },
    {
        path: 'piviewprofile', component: PIviewprofileComponent
    }
];