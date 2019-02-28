import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterSetupPage } from './master-setup.page';
import { MasterSetupRoutingModule } from './master-setup-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterSetupRoutingModule,
  ],
  declarations: [MasterSetupPage]
})
export class MasterSetupPageModule {}
