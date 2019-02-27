import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'tabs',
    loadChildren: '../pages/admin/master-setup/master-setup.module#MasterSetupPageModule'
  },
  {
    path: 'user-setup',
    loadChildren: '../pages/admin/user-setup/user-setup.module#UserSetupPageModule'
  },
  {
    path: 'user-setup-edit',
    loadChildren: '../pages/admin/user-setup/form/user-setup-form.module#UserSetupFormPageModule'
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
