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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { GeneralLeavePolicyPage } from './general-leave-policy.page';
import { CreatePolicyPage } from './create-policy/create-policy.page';
import { MatRadioModule } from '@angular/material';
import { PolicyListPage } from './policy-list/policy-list.page';


const routes: Routes = [
    {
        path: '',
        component: GeneralLeavePolicyPage
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
        InlineSVGModule,
        SpinnerModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatButtonModule,
        MatRadioModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [],
    declarations: [GeneralLeavePolicyPage, CreatePolicyPage, PolicyListPage]
})
export class GeneralLeavePolicyModule { }
