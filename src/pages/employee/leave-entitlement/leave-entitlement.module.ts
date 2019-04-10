import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LeaveEntitlementPage } from './leave-entitlement.page';
import { InlineSVGModule } from 'ng-inline-svg';
import { ApplyLeavePage } from './apply-leave/apply-leave.page';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';


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
    MatTabsModule,
    BrowserModule,
    FullCalendarModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatRadioModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveEntitlementPage, ApplyLeavePage]
})
export class LeaveEntitlementModule { }
