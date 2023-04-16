import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { ContactComponent } from './Components/contact/contact.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
  {path:"", component: AdminDashboardComponent, children:[
    {path: "home", component: HomeComponent},
    {path: "contact", component: ContactComponent},
    {path: "dashboard", component: DashboardComponent},
    {path: "", redirectTo: "/admin/dashboard", pathMatch: 'full'}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
