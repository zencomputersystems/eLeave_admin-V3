import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LeaveEntitlementPage } from './leave-entitlement.page';
import { InlineSVGModule } from 'ng-inline-svg';


const routes: Routes = [
  {
    path: '',
    component: LeaveEntitlementPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InlineSVGModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveEntitlementPage]
})
export class LeaveEntitlementModule { }
