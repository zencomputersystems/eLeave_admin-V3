import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { AddEmployeeComponent } from '../admin-setup/add-employee/add-employee.component';
import { LeaveSetupComponent } from '../admin-setup/leave-setup/leave-setup.component';
import { LeaveSetupTabComponent } from '../admin-setup/leave-setup/leave-setup-tab/leave-setup-tab.component';
import { AdminInvitesComponent } from '../admin-setup/invites/admin-invites.component';
import { InviteListComponent } from '../admin-setup/invites/invite-list/invite-list.component';
import { InviteMoreComponent } from '../admin-setup/invites/invite-more/invite-more.component';
import { RoleManagementComponent } from '../admin-setup/role-management/role-management.component';
import { RoleListComponent } from '../admin-setup/role-management/role-list/role-list.component';
import { RoleRightsComponent } from '../admin-setup/role-management/role-rights/role-rights.component';
import { AssignRoleComponent } from '../admin-setup/role-management/assign-role/assign-role.component';
import { GeneralLeavePolicyComponent } from '../admin-setup/general-leave-policy/general-leave-policy.component';
import { PolicyListComponent } from '../admin-setup/general-leave-policy/policy-list/policy-list.component';
import { CreatePolicyComponent } from '../admin-setup/general-leave-policy/create-policy/create-policy.component';
import { EmployeeProfileComponent } from '../admin-setup/employee-profile-hr/employee-profile.component';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: PageNotFoundComponent },
            { path: 'inbox', component: AddEmployeeComponent }, // AddEmployeeComponent //EmployeeProfileComponent
            {
                path: 'leave-setup', component: LeaveSetupComponent,
                children: [
                    { path: '', redirectTo: 'tab', pathMatch: 'full' },
                    { path: 'tab', component: LeaveSetupTabComponent }
                ]
            },
            {
                path: 'employee-setup', component: AdminInvitesComponent,
                children: [
                    { path: '', redirectTo: 'invite-list', pathMatch: 'full' },
                    { path: 'invite-list', component: InviteListComponent },
                    { path: 'invite-more', component: InviteMoreComponent },
                ]
            },
            {
                path: 'role-management', component: RoleManagementComponent,
                children: [
                    { path: '', redirectTo: 'role-list', pathMatch: 'full' },
                    { path: 'role-list', component: RoleListComponent },
                    { path: 'role-rights/:id', component: RoleRightsComponent },
                    { path: 'create-new-role', component: RoleRightsComponent },
                    { path: 'assign-role', component: AssignRoleComponent }
                ]
            },
            {
                path: 'general-leave-policy', component: GeneralLeavePolicyComponent,
                children: [
                    { path: '', redirectTo: 'policy-list', pathMatch: 'full' },
                    { path: 'policy-list', component: PolicyListComponent },
                    { path: 'edit-policy/:id', component: CreatePolicyComponent }
                ]
            },
            { path: 'employee-profile', component: EmployeeProfileComponent }
        ]
    },
    { path: '**', component: PageNotFoundComponent },
];

