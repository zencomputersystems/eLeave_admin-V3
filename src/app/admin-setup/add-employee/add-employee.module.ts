import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { AddEmployeeComponent } from './add-employee.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { BulkImportComponent } from './bulk-import/bulk-import.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BulkImportSuccessComponent } from './bulk-import-success/bulk-import-success.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileDropModule } from 'ngx-file-drop';
import { AddOneEmployeeComponent } from './add-one-employee/add-one-employee.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


const routes: Routes = [
    {
        path: '',
        component: AddEmployeeComponent
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
    declarations: [AddEmployeeComponent, BulkImportComponent, BulkImportSuccessComponent, AddOneEmployeeComponent],
    entryComponents: [BulkImportComponent, BulkImportSuccessComponent, AddOneEmployeeComponent]
})
export class AddEmployeeModule { }
