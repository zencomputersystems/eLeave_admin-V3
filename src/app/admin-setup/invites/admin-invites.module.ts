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
import { InviteMoreComponent } from './invite-more/invite-more.component';
import { InviteListComponent } from './invite-list/invite-list.component';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { DeleteListConfirmationComponent } from './delete-list-confirmation/delete-list-confirmation.component';
import { MatDialogModule, MatButtonModule, MatMenuModule, MatDatepickerModule } from '@angular/material';
import { DateDialogComponent } from './date-dialog/date-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BulkImportComponent } from './invite-list/bulk-import/bulk-import.component';
import { FileDropModule } from 'ngx-file-drop';
import { AddOneEmployeeComponent } from './invite-list/add-one-employee/add-one-employee.component';


const routes: Routes = [
    {
        path: '',
        component: InviteListComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatGridListModule,
        MatCardModule,
        InlineSVGModule,
        SpinnerModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatDatepickerModule,
        NgxPaginationModule,
        FileDropModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [DeleteListConfirmationComponent, DateDialogComponent],
    declarations: [InviteMoreComponent, InviteListComponent, DeleteListConfirmationComponent, DateDialogComponent, BulkImportComponent, AddOneEmployeeComponent]
})
export class AdminInvitesModule { }
