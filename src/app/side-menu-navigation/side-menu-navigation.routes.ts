import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { EmployeeSetupPage } from 'src/pages/admin/employee-setup/employee-setup.page';
import { HomePage } from '../home/home.page';
import { ConnectionsPage } from 'src/pages/admin/employee-setup/connections/connections.page';
import { PersonalDetailsPage } from 'src/pages/admin/employee-setup/personal-details/personal-details.page';
import { EmploymentDetailsPage } from 'src/pages/admin/employee-setup/employment-details/employment-details.page';
import { LeaveEntitlementPage } from 'src/pages/admin/employee-setup/leave-entitlement/leave-entitlement.page';
import { PageNotFoundComponent } from '../page-not-found.component';
import { PublicPersonalDetailsPage } from 'src/pages/admin/employee-setup/public-personal-details/public-personal-details.page';
import { EmployeeProfilePage } from 'src/pages/admin/admin-setup/employee-profile-hr/employee-profile.page';
import { InviteMorePage } from 'src/pages/admin/admin-setup/invites/inivite-more/invite-more.page';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: InviteMorePage },
            { path: 'inbox', component: ConnectionsPage },
            { path: 'plan-my-leave', component: PublicPersonalDetailsPage },
            { path: 'employee-directory', component: ConnectionsPage },
            {
                path: 'employee-setup', component: EmployeeSetupPage,
                children: [
                    { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
                    { path: 'personal-details', component: PersonalDetailsPage },
                    { path: 'employment-details/:id', component: EmploymentDetailsPage },
                    { path: 'leave-entitlement', component: LeaveEntitlementPage },
                    { path: 'awards-certification', component: PageNotFoundComponent },
                    { path: 'connection', component: ConnectionsPage },
                    { path: 'account', component: PageNotFoundComponent }
                ]
            }
        ]
    }
];

