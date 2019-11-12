import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { IonicModule } from '@ionic/angular';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { sideMenuNavigationRoutes } from './side-menu-navigation.routes';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { AdminInvitesModule } from '../admin-setup/invites/admin-invites.module';
import { LeaveSetupModule } from '../admin-setup/leave-setup/leave-setup.module';
import { RoleManagementModule } from '../admin-setup/role-management/role-management.module';
import { GeneralLeavePolicyModule } from '../admin-setup/general-leave-policy/general-leave-policy.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InlineSVGModule.forRoot(),
        HttpClientModule,
        AdminInvitesModule,
        MatMenuModule,
        LeaveSetupModule,
        RoleManagementModule,
        GeneralLeavePolicyModule,
        DashboardModule,
        MatChipsModule,
        RouterModule.forChild(sideMenuNavigationRoutes)
    ],
    providers: [AuthGuard],
    declarations: [SideMenuNavigationComponent]
})
export class SideMenuNavigationModule { }

