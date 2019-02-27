import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmployeeSetupPage } from './employee-setup.page';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSetupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmployeeSetupPage]
})
export class EmployeeSetupPageModule { }
