import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { AddEmployeePage } from './add-employee.page';
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { BulkImportPage } from './bulk-import/bulk-import.page';
import { MatDialogModule } from '@angular/material/dialog';


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
        RouterModule.forChild(routes)
    ],
    declarations: [AddEmployeePage, BulkImportPage],
    entryComponents: [BulkImportPage]
})
export class AddEmployeeModule { }
