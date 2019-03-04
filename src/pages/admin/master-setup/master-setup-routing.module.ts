import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterSetupPage } from './master-setup.page';
import { PersonalDetailsPage } from '../employee-setup/personal-details/personal-details.page';
import { EmployeeSetupPage } from '../employee-setup/employee-setup.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSetupPage,
    children: [
      {
        path: 'employee-setup',
        outlet: 'newContent',
        children: [
          {
            path: '',
            loadChildren: '../pages/admin/employee-setup/employee-setup.module#EmployeeSetupModule'
          },
          {
            path: 'personal-details',
            children: [
              {
                path: '',
                loadChildren: '../pages/admin/employee-setup/personal-details/personal-details.module#PersonalDetailsModule'
              }
            ]
          }
        ]
      },
      // {
      //   path: 'personal-details',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../employee-setup/personal-details/personal-details.module#PersonalDetailsModule'
      //     },
      //     {
      //       path: 'cost-centre-setup-edit',
      //       children: [
      //         {
      //           path: '',
      //           loadChildren: './home/home.module#HomePageModule'
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: 'leave-type-setup',
        children: [
          {
            path: '',
            loadChildren: './home/home.module#HomePageModule'
          },
          {
            path: 'leave-type-edit',
            children: [
              {
                path: '',
                loadChildren: './home/home.module#HomePageModule'
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
            loadChildren: './home/home.module#HomePageModule'
          },
          {
            path: 'branch-setup-edit',
            children: [
              {
                path: '',
                loadChildren: './home/home.module#HomePageModule'

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
            loadChildren: './home/home.module#HomePageModule'
          },
          {
            path: 'section-setup-edit',
            children: [
              {
                path: '',
                loadChildren: './home/home.module#HomePageModule'
              }
            ]
          },
        ]
      },
      // {
      //   path: 'personal-details',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../pages/admin/employee-setup/personal-details/personal-details.module#PersonalDetailsModule'
      //     },
      // {
      //   path: 'personal-details-setup',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../employee-setup/personal-details/personal-details.module#PersonalDetailsModule'
      //     }
      //   ]
      // },
      //   ]
      // },
      {
        path: '',
        redirectTo: '/personal-details/(newContent:newContent)',
        // component: PersonalDetailsPage,
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
export class MasterSetupRoutingModule { }
