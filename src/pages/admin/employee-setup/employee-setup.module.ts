import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { PersonalDetailsModule } from './personal-details/personal-details.module';
import { EmploymentDetailsModule } from './employment-details/employment-details.module';
import { LeaveEntitlementModule } from './leave-entitlement/leave-entitlement.module';
import { ConnectionsModule } from './connections/connections.module';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { EmployeeSetupPage } from './employee-setup.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    PersonalDetailsModule,
    EmploymentDetailsModule,
    LeaveEntitlementModule,
    ConnectionsModule,
    RouterModule
  ],
  providers: [AuthGuard],
  declarations: [EmployeeSetupPage]
})
export class EmployeeSetupPageModule {
}
