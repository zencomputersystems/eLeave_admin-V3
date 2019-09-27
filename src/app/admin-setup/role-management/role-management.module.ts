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
import { RoleManagementComponent } from './role-management.component';
import { RoleRightsComponent } from './role-rights/role-rights.component';
import { RoleListComponent } from './role-list/role-list.component';
import { LeaveSetupModule } from '../leave-setup/leave-setup.module';
import { AssignRoleComponent } from './assign-role/assign-role.component';
import { AssignCalendarTreeviewService } from '../leave-setup/assign-calendar/assign-calendar-treeview.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatDialogModule } from '@angular/material';
import { DialogDeleteConfirmationComponent } from './dialog-delete-confirmation/dialog-delete-confirmation.component';


const routes: Routes = [
    {
        path: '',
        component: RoleManagementComponent
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
    providers: [AssignCalendarTreeviewService],
    entryComponents: [DialogDeleteConfirmationComponent],
    declarations: [RoleManagementComponent, RoleRightsComponent, RoleListComponent, AssignRoleComponent, DialogDeleteConfirmationComponent]
})
export class RoleManagementModule { }
