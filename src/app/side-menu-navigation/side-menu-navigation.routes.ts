import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { LeaveSetupComponent } from '../admin-setup/leave-setup/leave-setup.component';
import { RoleListComponent } from '../admin-setup/role-management/role-list/role-list.component';
import { RoleRightsComponent } from '../admin-setup/role-management/role-rights/role-rights.component';
import { PolicyListComponent } from '../admin-setup/general-leave-policy/policy-list/policy-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CalendarProfileComponent } from '../admin-setup/leave-setup/calendar-profile/calendar-profile.component';
import { LeaveAdjustmentComponent } from '../admin-setup/leave-setup/leave-adjustment/leave-adjustment.component';
import { LeaveEntitlementByBatchComponent } from '../admin-setup/leave-setup/leave-entitlement-by-batch/leave-entitlement-by-batch.component';
import { WorkingHourListComponent } from '../admin-setup/leave-setup/working-hour/working-hour-list/working-hour-list.component';
import { EmployeeSetupComponent } from '../admin-setup/invites/employee-setup/employee-setup.component';
import { ApplyOnBehalfComponent } from '../admin-setup/leave-setup/apply-on-behalf/apply-on-behalf.component';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
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
                    { path: 'leave-entitlement-setup', component: PageNotFoundComponent },
                    { path: 'leave-adjustment', component: LeaveAdjustmentComponent },
                    { path: 'leave-entitlement-by-batch', component: LeaveEntitlementByBatchComponent },
                    { path: 'general-leave-policy', component: PolicyListComponent }
                ]
            },
            {
                path: 'employee-setup', component: EmployeeSetupComponent
            },
            {
                path: 'role-management', component: RoleListComponent
                // children: [
                //     { path: '', redirectTo: 'role-list', pathMatch: 'full' },
                //     { path: 'role-list', component: RoleListComponent },
                //     { path: 'role-rights/:id', component: RoleRightsComponent },
                //     { path: 'create-new-role', component: RoleRightsComponent },
                //     { path: 'assign-role', component: AssignRoleComponent }
                // ]
            },
            // {
            //     path: 'general-leave-policy', component: PolicyListComponent,
            //     children: [
            //         { path: '', redirectTo: 'policy-list', pathMatch: 'full' },
            //         { path: 'policy-list', component: PolicyListComponent },
            //         { path: 'edit-policy/:id', component: CreatePolicyComponent }
            //     ]
            // },
            { path: 'apply-on-behalf', component: ApplyOnBehalfComponent },
            { path: 'approval-override', component: PageNotFoundComponent },
        ]
    },
    { path: '**', component: PageNotFoundComponent },
];

