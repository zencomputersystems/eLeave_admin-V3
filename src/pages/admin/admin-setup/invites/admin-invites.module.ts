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
import { AdminInvitesPage } from './admin-invites.page';
import { InlineSVGModule } from 'ng-inline-svg';
import { InviteMorePage } from './inivite-more/invite-more.page';
import { InviteListPage } from './invite-list/invite-list.page';
import { SpinnerModule } from 'src/library/spinner/spinner.module';
import { DeleteListConfirmationPage } from './delete-list-confirmation/delete-list-confirmation.page';
import { MatDialogModule, MatButtonModule, MatMenuModule, MatDatepickerModule } from '@angular/material';
import { DateDialogPage } from './date-dialog/date-dialog.page';


const routes: Routes = [
    {
        path: '',
        component: AdminInvitesPage
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
    entryComponents: [DeleteListConfirmationPage, DateDialogPage],
    declarations: [AdminInvitesPage, InviteMorePage, InviteListPage, DeleteListConfirmationPage, DateDialogPage]
})
export class AdminInvitesModule { }
