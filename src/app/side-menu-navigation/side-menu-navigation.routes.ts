import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { AddEmployeePage } from '../admin-setup/add-employee/add-employee.component';
import { LeaveSetup } from '../admin-setup/leave-setup/leave-setup';
import { LeaveSetupTabPage } from '../admin-setup/leave-setup/leave-setup-tab/leave-setup-tab.component';
import { AdminInvitesPage } from '../admin-setup/invites/admin-invites.component';
import { InviteListPage } from '../admin-setup/invites/invite-list/invite-list.component';
import { InviteMorePage } from '../admin-setup/invites/invite-more/invite-more.component';
import { RoleManagementPage } from '../admin-setup/role-management/role-management.component';
import { RoleListPage } from '../admin-setup/role-management/role-list/role-list.component';
import { RoleRightsPage } from '../admin-setup/role-management/role-rights/role-rights.component';
import { AssignRolePage } from '../admin-setup/role-management/assign-role/assign-role.component';
import { GeneralLeavePolicyPage } from '../admin-setup/general-leave-policy/general-leave-policy.component';
import { PolicyListPage } from '../admin-setup/general-leave-policy/policy-list/policy-list.component';
import { CreatePolicyPage } from '../admin-setup/general-leave-policy/create-policy/create-policy.component';
import { EmployeeProfilePage } from '../admin-setup/employee-profile-hr/employee-profile.component';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: PageNotFoundComponent },
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
                    { path: 'edit-policy/:id', component: CreatePolicyPage }
                ]
            },
            { path: 'employee-profile', component: EmployeeProfilePage }
        ]
    },
    { path: '**', component: PageNotFoundComponent },
];

