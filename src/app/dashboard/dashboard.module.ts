import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { SpinnerModule } from '../../../src/library/spinner/spinner.module';
import { MatTooltipModule, MatDialogModule, MatRadioModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserModule } from '@angular/platform-browser';
import { EditorModule } from 'primeng/editor';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskConfirmationDialogComponent } from './task-confirmation-dialog/task-confirmation-dialog.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatGridListModule,
        SpinnerModule,
        MatTooltipModule,
        MatChipsModule,
        // BrowserModule,
        EditorModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule,
        MatRadioModule,
        RouterModule.forChild(routes)
    ],
    declarations: [DashboardComponent, TaskConfirmationDialogComponent],
    entryComponents: [TaskConfirmationDialogComponent]
})
export class DashboardModule { }

