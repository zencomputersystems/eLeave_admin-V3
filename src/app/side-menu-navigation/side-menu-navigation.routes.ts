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
import { RoleManagementPage } from 'src/pages/admin/admin-setup/role-management/role-management.page';
import { RoleRightsPage } from 'src/pages/admin/admin-setup/role-management/role-rights/role-rights.page';
import { RoleListPage } from 'src/pages/admin/admin-setup/role-management/role-list/role-list.page';
import { InviteListPage } from 'src/pages/admin/admin-setup/invites/invite-list/invite-list.page';
import { AssignRolePage } from 'src/pages/admin/admin-setup/role-management/assign-role/assign-role.page';
import { SetupCalendarProfilePage } from 'src/pages/admin/admin-setup/public-holiday-setup/setup-calendar-profile/setup-calendar-profile.page';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: EmployeeProfilePage },
            { path: 'inbox', component: AddEmployeePage }, // AddEmployeePage //EmployeeProfilePage
            {
                path: 'plan-my-leave', component: PublicHolidaySetup,
                children: [
                    { path: '', redirectTo: 'public-holiday-setup', pathMatch: 'full' },
                    { path: 'public-holiday-setup', component: SetupCalendarProfilePage }
                ]
            },
            {
                path: 'employee-directory', component: AdminInvitesPage,
                children: [
                    { path: '', redirectTo: 'invite-list', pathMatch: 'full' },
                    { path: 'invite-list', component: InviteListPage },
                    { path: 'invite-more', component: InviteMorePage },
                ]
            },
            {
                path: 'role-management', component: RoleManagementPage,
                children: [
                    { path: '', redirectTo: 'role-list', pathMatch: 'full' },
                    { path: 'role-list', component: RoleListPage },
                    { path: 'role-rights/:id', component: RoleRightsPage },
                    { path: 'create-new-role', component: RoleRightsPage },
                    { path: 'assign-role', component: AssignRolePage }
                ]
            },
        ]
    },
    { path: '**', component: PageNotFoundComponent },
];

