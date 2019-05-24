import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { AddEmployeePage } from './add-employee.page';
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { BulkImportPage } from './bulk-import/bulk-import.page';
import { MatDialogModule } from '@angular/material/dialog';
import { BulkImportSuccessPage } from './bulk-import-success/bulk-import-success.page';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileDropModule } from 'ngx-file-drop';
import { AddOneEmployeePage } from './add-one-employee/add-one-employee.page';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


const routes: Routes = [
    {
        path: '',
        component: AddEmployeePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatCardModule,
        InlineSVGModule,
        SpinnerModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FileDropModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,
        RouterModule.forChild(routes)
    ],
    declarations: [AddEmployeePage, BulkImportPage, BulkImportSuccessPage, AddOneEmployeePage],
    entryComponents: [BulkImportPage, BulkImportSuccessPage, AddOneEmployeePage]
})
export class AddEmployeeModule { }
