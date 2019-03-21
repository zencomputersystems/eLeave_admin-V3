import { Routes } from '@angular/router';
import { EmployeeSetupPage } from './employee-setup.page';
import { PersonalDetailsPage } from './personal-details/personal-details.page';
import { EmploymentDetailsPage } from './employment-details/employment-details.page';
import { LeaveEntitlementPage } from './leave-entitlement/leave-entitlement.page';
import { PageNotFoundComponent } from 'src/app/page-not-found.component';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';


export const employeeSetupRoutes: Routes = [
    {
        path: 'employee-setup',
        component: EmployeeSetupPage,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
            {
                path: 'personal-details', component: PersonalDetailsPage,
                // canActivate: [RoleGuard], data: {role: 'Admin'},
            },
            { path: 'employment-details/:id', component: EmploymentDetailsPage },
            { path: 'leave-entitlement', component: LeaveEntitlementPage },
            { path: 'awards-certification', component: PageNotFoundComponent },
            { path: 'connection', component: PageNotFoundComponent },
            { path: 'account', component: PageNotFoundComponent }
        ]
    }
];