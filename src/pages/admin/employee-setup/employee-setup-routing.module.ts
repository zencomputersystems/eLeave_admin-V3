import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCentreSetupPage } from '../cost-centre-setup/cost-centre-setup.page';
import { EmployeeSetupPage } from './employee-setup.page';
import { PersonalDetailsPage } from './personal-details/personal-details.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSetupPage,
    children: [
      {
        path: 'personal-details',
        children: [
          {
            path: '',
            loadChildren: '../pages/admin/employee-setup/personal-details/personal-details.module#PersonalDetailsModule'
          },
          {
            path: 'cost-centre-setup-edit',
            children: [
              {
                path: '',
                loadChildren: '../cost-centre-setup/form/cost-centre-setup-form.module#CostCentreSetupFormPageModule'
              }
            ]
          }
        ]
      },
      {
        path: 'leave-type-setup',
        children: [
          {
            path: '',
            loadChildren: '../leave-type-setup/leave-type-setup.module#LeaveTypeSetupPageModule'
          },
          {
            path: 'leave-type-edit',
            children: [
              {
                path: '',
                loadChildren: '../leave-type-setup/form/leave-type-setup-form.module#LeaveTypeSetupFormModule'
              }
            ]
          }
        ]
      },
      {
        path: 'branch-setup',
        children: [
          {
            path: '',
            loadChildren: '../branch-setup/branch-setup.module#BranchSetupPageModule'
          },
          {
            path: 'branch-setup-edit',
            children: [
              {
                path: '',
                loadChildren: '../branch-setup/form/branch-setup-form.module#BranchSetupFormPageModule'

              }
            ]
          }
        ]
      },
      {
        path: 'section-setup',
        children: [
          {
            path: '',
            loadChildren: '../section-setup/section-setup.module#SectionSetupPageModule'
          },
          {
            path: 'section-setup-edit',
            children: [
              {
                path: '',
                loadChildren: '../section-setup/form/section-setup-form.module#SectionSetupFormPageModule'
              }
            ]
          },
        ]
      },
      {
        path: '',
        component: EmployeeSetupPage,
      }
    ]
   }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployeeSetupRoutingModule {}
