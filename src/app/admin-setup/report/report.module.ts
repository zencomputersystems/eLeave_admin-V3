import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDatepickerModule, MatInputModule } from '@angular/material';
import { ReportComponent } from './report.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
    {
        path: '',
        component: ReportComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        SpinnerModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatDialogModule,
        MatDatepickerModule,
        InlineSVGModule,
        MatMenuModule,
        MatIconModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    entryComponents: [],
    declarations: [ReportComponent]
})
export class ReportModule { }
