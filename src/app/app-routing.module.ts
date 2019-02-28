import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    path: 'employee-setup',
    loadChildren: '../pages/admin/employee-setup/employee-setup.module#EmployeeSetupPageModule'
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
