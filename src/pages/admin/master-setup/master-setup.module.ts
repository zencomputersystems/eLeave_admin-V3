import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterSetupPage } from './master-setup.page';
import { MasterSetupRoutingModule } from './master-setup-routing.module';
import { EmployeeSetupModule } from '../employee-setup/employee-setup.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeSetupModule,
    MasterSetupRoutingModule,
  ],
  declarations: [MasterSetupPage]
})
export class MasterSetupPageModule {}
