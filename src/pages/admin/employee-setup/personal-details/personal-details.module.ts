import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonalDetailsPage } from './personal-details.page';
import { MatCardModule } from '@angular/material/card';
import { JwtService } from 'src/app/jwt.service';


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
  providers: [JwtService],
  declarations: [PersonalDetailsPage]
})
export class PersonalDetailsModule { }
