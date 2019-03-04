import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { EmploymentDetailsPage } from './employment-details.page';


const routes: Routes = [
    {
        path: '',
        component: EmploymentDetailsPage
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
    declarations: [EmploymentDetailsPage]
})
export class EmploymentDetailsModule { }
