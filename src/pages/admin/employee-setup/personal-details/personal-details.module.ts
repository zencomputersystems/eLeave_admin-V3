import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonalDetailsPage } from './personal-details.page';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';


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
    InlineSVGModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [PersonalDetailsPage]
})
export class PersonalDetailsModule { }
