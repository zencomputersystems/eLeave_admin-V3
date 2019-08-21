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
import { RoleManagementPage } from 'src/pages/admin/admin-setup/role-management/role-management.page';
import { RoleRightsPage } from 'src/pages/admin/admin-setup/role-management/role-rights/role-rights.page';
import { RoleListPage } from 'src/pages/admin/admin-setup/role-management/role-list/role-list.page';
import { InviteListPage } from 'src/pages/admin/admin-setup/invites/invite-list/invite-list.page';
import { AssignRolePage } from 'src/pages/admin/admin-setup/role-management/assign-role/assign-role.page';
import { LeaveSetup } from 'src/pages/admin/admin-setup/leave-setup/leave-setup';
import { GeneralLeavePolicyPage } from 'src/pages/admin/admin-setup/general-leave-policy/general-leave-policy.page';
import { CreatePolicyPage } from 'src/pages/admin/admin-setup/general-leave-policy/create-policy/create-policy.page';
import { PolicyListPage } from 'src/pages/admin/admin-setup/general-leave-policy/policy-list/policy-list.page';
import { LeaveSetupTabPage } from 'src/pages/admin/admin-setup/leave-setup/leave-setup-tab/leave-setup-tab.page';

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
                path: 'leave-setup', component: LeaveSetup,
                children: [
                    { path: '', redirectTo: 'tab', pathMatch: 'full' },
                    { path: 'tab', component: LeaveSetupTabPage }
                ]
            },
            {
                path: 'employee-setup', component: AdminInvitesPage,
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
            {
                path: 'general-leave-policy', component: GeneralLeavePolicyPage,
                children: [
                    { path: '', redirectTo: 'policy-list', pathMatch: 'full' },
                    { path: 'policy-list', component: PolicyListPage },
                    { path: 'create-policy', component: CreatePolicyPage },
                    { path: 'edit-policy/:id', component: CreatePolicyPage }
                ]
            },
            { path: 'employee-profile', component: EmployeeProfilePage }
        ]
    },
    { path: '**', component: PageNotFoundComponent },
];

