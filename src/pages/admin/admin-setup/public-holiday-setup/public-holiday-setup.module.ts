import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar
import { ManageHolidayPage } from './manage-holiday/manage-holiday.page';
import { PublicHolidaySetup } from './public-holiday-setup';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AssignCalendarPage } from './assign-calendar/assign-calendar.page';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarNotificationPage } from './snackbar-notification/snackbar-notification';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ClickOutsideModule } from 'ng-click-outside';
import { EmployeeListDatabase } from './assign-calendar/assign-calendar-treeview.service';


const routes: Routes = [
    {
        path: '',
        component: PublicHolidaySetup
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatGridListModule,
        MatCardModule,
        MatTabsModule,
        InlineSVGModule,
        FullCalendarModule,
        SpinnerModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatTreeModule,
        MatCheckboxModule,
        MatButtonModule,
        ClickOutsideModule,
        RouterModule.forChild(routes)
    ],
    providers:[EmployeeListDatabase],
    entryComponents: [SnackbarNotificationPage],
    declarations: [ManageHolidayPage, PublicHolidaySetup, AssignCalendarPage, SnackbarNotificationPage]
})
export class PublicHolidaySetupModule { }
