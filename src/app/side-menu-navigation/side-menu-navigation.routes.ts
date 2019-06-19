import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { EmployeeProfilePage } from 'src/pages/admin/admin-setup/employee-profile-hr/employee-profile.page';
import { InviteMorePage } from 'src/pages/admin/admin-setup/invites/inivite-more/invite-more.page';
import { AdminInvitesPage } from 'src/pages/admin/admin-setup/invites/admin-invites.page';
import { AddEmployeePage } from 'src/pages/admin/admin-setup/add-employee/add-employee.page';
import { BulkImportPage } from 'src/pages/admin/admin-setup/add-employee/bulk-import/bulk-import.page';
import { BulkImportSuccessPage } from 'src/pages/admin/admin-setup/add-employee/bulk-import-success/bulk-import-success.page';
import { AddOneEmployeePage } from 'src/pages/admin/admin-setup/add-employee/add-one-employee/add-one-employee.page';
import { PublicHolidaySetup } from 'src/pages/admin/admin-setup/public-holiday-setup/public-holiday-setup';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: EmployeeProfilePage },
            { path: 'inbox', component: AddEmployeePage }, // AddEmployeePage //EmployeeProfilePage
            { path: 'plan-my-leave', component: PublicHolidaySetup },
            { path: 'employee-directory', component: AdminInvitesPage },
            { path: 'invite-more', component: InviteMorePage },
            // { path: 'user-public-profile', component: PublicPersonalDetailsPage },
            // {
            //     path: 'employee-setup', component: EmployeeSetupPage,
            //     children: [
            //         { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
            //         { path: 'personal-details', component: PersonalDetailsPage },
            //         { path: 'employment-details/:id', component: EmploymentDetailsPage },
            //         { path: 'leave-entitlement', component: LeaveEntitlementPage },
            //         { path: 'awards-certification', component: PageNotFoundComponent },
            //         { path: 'connection', component: ConnectionsPage },
            //         { path: 'account', component: AccountSettingPage }
            //     ]
            // }
        ]
    }
];

