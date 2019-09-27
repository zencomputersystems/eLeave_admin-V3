import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { EmployeeProfileComponent } from './employee-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { PersonalComponent } from './personal/personal.component';
import { EmploymentComponent } from './employment/employment.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SpinnerModule } from 'src/library/spinner/spinner.module';


const routes: Routes = [
    {
        path: '',
        component: EmployeeProfileComponent
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
        MatDatepickerModule,
        ReactiveFormsModule,
        SpinnerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [EmployeeProfileComponent, PersonalComponent, EmploymentComponent]
})
export class EmployeeProfileModule { }
