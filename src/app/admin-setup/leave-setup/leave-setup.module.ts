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
import { CalendarProfileComponent } from './calendar-profile/calendar-profile.component';
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent } from './snackbar-notification/snackbar-notification.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ClickOutsideModule } from 'ng-click-outside';
import { AssignCalendarTreeviewService } from './assign-calendar/assign-calendar-treeview.service';
import { ApplyOnBehalfComponent } from '../apply-on-behalf/apply-on-behalf.component';
import { MatRadioModule, MatDialogModule } from '@angular/material';
import { LeaveSetupComponent } from './leave-setup.component';
import { ApprovalOverrideComponent } from '../approval-override/approval-override.component';
import { LeaveAdjustmentComponent } from './leave-adjustment/leave-adjustment.component';
import { LeaveEntitlementByBatchComponent } from './leave-entitlement-by-batch/leave-entitlement-by-batch.component';
import { DeleteCalendarConfirmationComponent } from './delete-calendar-confirmation/delete-calendar-confirmation.component';
import { WorkingHourComponent } from './working-hour/working-hour.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { WorkingHourListComponent } from './working-hour/working-hour-list/working-hour-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import 'hammerjs';
import { EditModeDialogComponent } from './edit-mode-dialog/edit-mode-dialog.component';
import { DndModule } from 'ngx-drag-drop';
import { LeaveEntitlementComponent } from './leave-entitlement/leave-entitlement.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedService } from './shared.service';
import { RouteDialogComponent } from './route-dialog/route-dialog.component';
import { ConfirmationWindowComponent } from '../../global/confirmation-window/confirmation-window.component';
import { NotificationRuleComponent } from './notification-rule/notification-rule.component';

const routes: Routes = [
    {
        path: '',
        component: LeaveSetupComponent
    }
];

@NgModule({
    imports: [
        NgbModule,
        CommonModule,
        FormsModule,
        IonicModule,
        // BrowserAnimationsModule,
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
        MatRadioModule,
        MatDialogModule,
        NgxMaterialTimepickerModule,
        MatChipsModule,
        NgbTimepickerModule,
        DndModule,
        MatMenuModule,
        RouterModule.forChild(routes)
    ],
    providers: [AssignCalendarTreeviewService, SharedService],
    entryComponents: [SnackbarNotificationComponent, DeleteCalendarConfirmationComponent, EditModeDialogComponent, ConfirmationWindowComponent,
         RouteDialogComponent],
    declarations: [CalendarProfileComponent, LeaveSetupComponent, SnackbarNotificationComponent, DeleteCalendarConfirmationComponent,
        ApplyOnBehalfComponent, ApprovalOverrideComponent, LeaveAdjustmentComponent, LeaveEntitlementByBatchComponent, WorkingHourComponent,
        WorkingHourListComponent, EditModeDialogComponent, LeaveEntitlementComponent, RouteDialogComponent, NotificationRuleComponent]
})
export class LeaveSetupModule { }
