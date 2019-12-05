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
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { LeaveSetupModule } from '../leave-setup/leave-setup.module';
import { MatDialogModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { YearEndClosingComponent } from './year-end-closing.component';
import { DialogSubmitConfirmationComponent } from './dialog-submit-confirmation/dialog-submit-confirmation.component';


const routes: Routes = [
    {
        path: '',
        component: YearEndClosingComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatSelectModule,
        MatFormFieldModule,
        SpinnerModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatDialogModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    entryComponents: [DialogSubmitConfirmationComponent],
    declarations: [YearEndClosingComponent, DialogSubmitConfirmationComponent]
})
export class YearEndClosingModule { }
