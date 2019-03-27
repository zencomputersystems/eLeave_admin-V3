import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeProfilePage } from './employee-profile.page';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { PersonalPage } from './personal/personal.page';
import { EmploymentPage } from './employment/employment.page';


const routes: Routes = [
    {
        path: '',
        component: EmployeeProfilePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatGridListModule,
        MatCardModule,
        MatTabsModule,
        InlineSVGModule.forRoot(),
        HttpClientModule,
        RouterModule.forChild(routes)
    ],
    declarations: [EmployeeProfilePage, PersonalPage, EmploymentPage]
})
export class EmployeeProfileModule { }
