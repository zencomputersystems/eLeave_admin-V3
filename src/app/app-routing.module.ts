import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeSetupPage } from 'src/pages/admin/employee-setup/employee-setup.page';
import { PersonalDetailsPage } from 'src/pages/admin/employee-setup/personal-details/personal-details.page';
import { EmploymentDetailsPage } from 'src/pages/admin/employee-setup/employment-details/employment-details.page';
import { LeaveEntitlementPage } from 'src/pages/admin/employee-setup/leave-entitlement/leave-entitlement.page';
import { ConnectionsPage } from 'src/pages/admin/employee-setup/connections/connections.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'inbox',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'plan-my-leave',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'user-setup-edit',
    loadChildren: './home/home.module#HomePageModule'
  },

  {
    path: 'employee-setup', component: EmployeeSetupPage, children: [
      { path: 'personal-details', component: PersonalDetailsPage },
      { path: 'employment-details', component: EmploymentDetailsPage },
      { path: 'leave-entitlement', component: LeaveEntitlementPage },
      { path: 'connection', component: ConnectionsPage },
      { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
    ]
  },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
