import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmployeeSetupPage } from './employee-setup.page';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeSetupRoutingModule } from './employee-setup-routing.module';
import { PersonalDetailsModule } from './personal-details/personal-details.module';

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
    PersonalDetailsModule,
    EmployeeSetupRoutingModule,
    RouterModule.forChild(routes),
  ],
  declarations: [EmployeeSetupPage]
})
export class EmployeeSetupPageModule { }
