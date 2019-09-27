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
import { RoleManagementPage } from './role-management.component';
import { RoleRightsPage } from './role-rights/role-rights.component';
import { RoleListPage } from './role-list/role-list.component';
import { LeaveSetupModule } from '../leave-setup/leave-setup.module';
import { AssignRolePage } from './assign-role/assign-role.component';
import { EmployeeListDatabase } from '../leave-setup/assign-calendar/assign-calendar-treeview.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatDialogModule } from '@angular/material';
import { DialogDeleteConfirmationPage } from './dialog-delete-confirmation/dialog-delete-confirmation.component';


const routes: Routes = [
    {
        path: '',
        component: RoleManagementPage
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
        MatTreeModule,
        MatCheckboxModule,
        MatButtonModule,
        LeaveSetupModule,
        ClickOutsideModule,
        MatDialogModule,
        RouterModule.forChild(routes)
    ],
    providers: [EmployeeListDatabase],
    entryComponents: [DialogDeleteConfirmationPage],
    declarations: [RoleManagementPage, RoleRightsPage, RoleListPage, AssignRolePage, DialogDeleteConfirmationPage]
})
export class RoleManagementModule { }
