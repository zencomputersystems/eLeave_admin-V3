import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { EmployeeSetupPage } from 'src/pages/employee/employee-setup.page';
import { PageNotFoundComponent } from '../page-not-found.component';
import { EmployeeProfilePage } from 'src/pages/admin/admin-setup/employee-profile-hr/employee-profile.page';
import { InviteMorePage } from 'src/pages/admin/admin-setup/invites/inivite-more/invite-more.page';
import { AdminInvitesPage } from 'src/pages/admin/admin-setup/invites/admin-invites.page';
import { PublicPersonalDetailsPage } from 'src/pages/employee/public-personal-details/public-personal-details.page';
import { ConnectionsPage } from 'src/pages/employee/connections/connections.page';
import { PersonalDetailsPage } from 'src/pages/employee/personal-details/personal-details.page';
import { EmploymentDetailsPage } from 'src/pages/employee/employment-details/employment-details.page';
import { LeaveEntitlementPage } from 'src/pages/employee/leave-entitlement/leave-entitlement.page';
import { AccountSettingPage } from 'src/pages/employee/account-setting/account-setting.page';
import { LeavePlanningPage } from 'src/pages/employee/leave-entitlement/leave-planning/leave-planning.page';
import { AddEmployeePage } from 'src/pages/admin/admin-setup/add-employee/add-employee.page';
import { BulkImportPage } from 'src/pages/admin/admin-setup/add-employee/bulk-import/bulk-import.page';
import { BulkImportSuccessPage } from 'src/pages/admin/admin-setup/add-employee/bulk-import-success/bulk-import-success.page';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminInvitesPage },
            { path: 'inbox', component: EmployeeProfilePage }, // AddEmployeePage
            { path: 'plan-my-leave', component: LeavePlanningPage },
            { path: 'employee-directory', component: ConnectionsPage },
            { path: 'invite-more', component: InviteMorePage },
            { path: 'user-public-profile', component: PublicPersonalDetailsPage },
            {
                path: 'employee-setup', component: EmployeeSetupPage,
                children: [
                    { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
                    { path: 'personal-details', component: PersonalDetailsPage },
                    { path: 'employment-details/:id', component: EmploymentDetailsPage },
                    { path: 'leave-entitlement', component: LeaveEntitlementPage },
                    { path: 'awards-certification', component: PageNotFoundComponent },
                    { path: 'connection', component: ConnectionsPage },
                    { path: 'account', component: AccountSettingPage }
                ]
            }
        ]
    }
];

