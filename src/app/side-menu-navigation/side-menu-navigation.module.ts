import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { IonicModule } from '@ionic/angular';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { sideMenuNavigationRoutes } from './side-menu-navigation.routes';
import { EmployeeSetupPageModule } from 'src/pages/employee/employee-setup.module';
import { AdminInvitesModule } from 'src/pages/admin/admin-setup/invites/admin-invites.module';
import { EmployeeProfileModule } from 'src/pages/admin/admin-setup/employee-profile-hr/employee-profile.module';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { PublicPersonalDetailsModule } from 'src/pages/employee/public-personal-details/public-personal-details.module';
import { AddEmployeeModule } from 'src/pages/admin/admin-setup/add-employee/add-employee.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InlineSVGModule.forRoot(),
        HttpClientModule,
        EmployeeSetupPageModule,
        PublicPersonalDetailsModule,
        AdminInvitesModule,
        EmployeeProfileModule,
        MatMenuModule,
        AddEmployeeModule,
        RouterModule.forChild(sideMenuNavigationRoutes)
    ],
    providers: [AuthGuard],
    declarations: [SideMenuNavigationComponent]
})
export class SideMenuNavigationModule { }

