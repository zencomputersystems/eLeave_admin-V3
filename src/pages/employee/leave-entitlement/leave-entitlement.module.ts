import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LeaveEntitlementPage } from './leave-entitlement.page';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { LeavePlanningPage } from './leave-planning/leave-planning.page';
import { ApplyLeavePage } from './leave-planning/apply-leave/apply-leave.page';
import { CalendarViewPage } from './leave-planning/calendar-view/calendar-view.page';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationPage } from './leave-planning/apply-leave/notification/notification.page';


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
    SpinnerModule,
    MatSnackBarModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [NotificationPage],
  declarations: [LeaveEntitlementPage, LeavePlanningPage, ApplyLeavePage, CalendarViewPage, NotificationPage]
})
export class LeaveEntitlementModule { }
