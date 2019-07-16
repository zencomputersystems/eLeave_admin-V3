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
import { RoleManagementPage } from './role-management.page';
import { RoleRightsPage } from './role-rights/role-rights.page';
import { RoleListPage } from './role-list/role-list.page';
import { PublicHolidaySetupModule } from '../public-holiday-setup/public-holiday-setup.module';
import { AssignRolePage } from './assign-role/assign-role.page';
import { EmployeeListDatabase } from '../public-holiday-setup/assign-calendar/assign-calendar-treeview.service';
import { ClickOutsideModule } from 'ng-click-outside';


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
        PublicHolidaySetupModule,
        ClickOutsideModule,
        RouterModule.forChild(routes)
    ],
    providers: [EmployeeListDatabase],
    entryComponents: [],
    declarations: [RoleManagementPage, RoleRightsPage, RoleListPage, AssignRolePage]
})
export class RoleManagementModule { }
