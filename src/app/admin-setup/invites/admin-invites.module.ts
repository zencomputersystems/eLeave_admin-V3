import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { AdminInvitesComponent } from './admin-invites.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { InviteMoreComponent } from './invite-more/invite-more.component';
import { InviteListComponent } from './invite-list/invite-list.component';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { DeleteListConfirmationComponent } from './delete-list-confirmation/delete-list-confirmation.component';
import { MatDialogModule, MatButtonModule, MatMenuModule, MatDatepickerModule } from '@angular/material';
import { DateDialogComponent } from './date-dialog/date-dialog.component';


const routes: Routes = [
    {
        path: '',
        component: AdminInvitesComponent
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
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatDatepickerModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [DeleteListConfirmationComponent, DateDialogComponent],
    declarations: [AdminInvitesComponent, InviteMoreComponent, InviteListComponent, DeleteListConfirmationComponent, DateDialogComponent]
})
export class AdminInvitesModule { }
