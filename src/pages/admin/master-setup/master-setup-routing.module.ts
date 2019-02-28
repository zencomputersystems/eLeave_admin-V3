import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterSetupPage } from './master-setup.page';

const routes: Routes = [
  {
    path: '',
    component: MasterSetupPage,
    children: [
      {
        path: 'cost-centre-setup',
        children: [
          {
            path: '',
            loadChildren: './home/home.module#HomePageModule'
          },
          {
            path: 'cost-centre-setup-edit',
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
      {
        path: '',
        component: MasterSetupPage,
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
export class MasterSetupRoutingModule {}
