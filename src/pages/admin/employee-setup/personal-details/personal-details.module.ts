import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonalDetailsPage } from './personal-details.page';
import { MatCardModule } from '@angular/material/card';


const routes: Routes = [
  {
    path: '',
    component: PersonalDetailsPage,
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
  declarations: [PersonalDetailsPage]
})
export class PersonalDetailsModule { }
