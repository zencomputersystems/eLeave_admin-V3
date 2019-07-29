import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { IonicModule } from '@ionic/angular';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { sideMenuNavigationRoutes } from './side-menu-navigation.routes';
import { AdminInvitesModule } from 'src/pages/admin/admin-setup/invites/admin-invites.module';
import { EmployeeProfileModule } from 'src/pages/admin/admin-setup/employee-profile-hr/employee-profile.module';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { AddEmployeeModule } from 'src/pages/admin/admin-setup/add-employee/add-employee.module';
import { RoleManagementModule } from 'src/pages/admin/admin-setup/role-management/role-management.module';
import { LeaveSetupModule } from 'src/pages/admin/admin-setup/leave-setup/leave-setup.module';
import { GeneralLeavePolicyModule } from 'src/pages/admin/admin-setup/general-leave-policy/general-leave-policy.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InlineSVGModule.forRoot(),
        HttpClientModule,
        AdminInvitesModule,
        EmployeeProfileModule,
        MatMenuModule,
        AddEmployeeModule,
        LeaveSetupModule,
        RoleManagementModule,
        GeneralLeavePolicyModule,
        RouterModule.forChild(sideMenuNavigationRoutes)
    ],
    providers: [AuthGuard],
    declarations: [SideMenuNavigationComponent]
})
export class SideMenuNavigationModule { }

