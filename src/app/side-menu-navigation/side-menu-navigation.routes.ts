import { Routes } from '@angular/router';
import { AuthGuard } from '../../../src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { LeaveSetupComponent } from '../admin-setup/leave-setup/leave-setup.component';
import { RoleListComponent } from '../admin-setup/role-management/role-list/role-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CalendarProfileComponent } from '../admin-setup/leave-setup/calendar-profile/calendar-profile.component';
import { LeaveAdjustmentComponent } from '../admin-setup/leave-setup/leave-adjustment/leave-adjustment.component';
import { LeaveEntitlementByBatchComponent } from '../admin-setup/leave-setup/leave-entitlement-by-batch/leave-entitlement-by-batch.component';
import { WorkingHourListComponent } from '../admin-setup/leave-setup/working-hour/working-hour-list/working-hour-list.component';
import { EmployeeSetupComponent } from '../admin-setup/invites/employee-setup/employee-setup.component';
import { ApplyOnBehalfComponent } from '../admin-setup/apply-on-behalf/apply-on-behalf.component';
import { YearEndClosingComponent } from '../admin-setup/year-end-closing/year-end-closing.component';
import { ApprovalOverrideComponent } from '../admin-setup/approval-override/approval-override.component';
import { LeaveEntitlementComponent } from '../admin-setup/leave-setup/leave-entitlement/leave-entitlement.component';
import { ReportComponent } from '../admin-setup/report/report.component';
import { PolicyListComponent } from '../admin-setup/leave-setup/general-leave-policy/policy-list/policy-list.component';
import { AttendanceComponent } from '../attendance-setup/attendance/attendance.component';
import { ClientComponent } from '../attendance-setup/client/client.component';
import { SupportComponent } from '../attendance-setup/support/support.component';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'administration',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'leave-setup', component: LeaveSetupComponent,
                children: [
                    { path: '', redirectTo: 'calendar-profile-setup', pathMatch: 'full' },
                    { path: 'calendar-profile-setup', component: CalendarProfileComponent },
                    { path: 'working-hour-setup', component: WorkingHourListComponent },
                    { path: 'leave-entitlement-setup', component: LeaveEntitlementComponent },
                    { path: 'leave-adjustment', component: LeaveAdjustmentComponent },
                    { path: 'leave-entitlement-by-batch', component: LeaveEntitlementByBatchComponent },
                    { path: 'general-leave-policy', component: PolicyListComponent }
                ]
            },
            { path: 'employee-setup', component: EmployeeSetupComponent },
            { path: 'role-management', component: RoleListComponent },
            { path: 'apply-on-behalf', component: ApplyOnBehalfComponent },
            { path: 'approval-override', component: ApprovalOverrideComponent },
            { path: 'year-end-closing', component: YearEndClosingComponent },
            { path: 'report', component: ReportComponent },
            { path: 'attendance', component: AttendanceComponent },
            { path: 'client', component: ClientComponent },
            { path: 'support', component: SupportComponent }
        ]
    },
    // { path: '**', component: PageNotFoundComponent },
];

