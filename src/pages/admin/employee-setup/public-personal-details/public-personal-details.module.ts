import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { PublicPersonalDetailsPage } from './public-personal-details.page';


const routes: Routes = [
  {
    path: '',
    component: PublicPersonalDetailsPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [PublicPersonalDetailsPage]
})
export class PublicPersonalDetailsModule { }
