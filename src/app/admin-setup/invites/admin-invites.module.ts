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
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { DeleteListConfirmationComponent } from './delete-list-confirmation/delete-list-confirmation.component';
import { MatDialogModule, MatButtonModule, MatMenuModule, MatDatepickerModule } from '@angular/material';
import { DateDialogComponent } from './date-dialog/date-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileDropModule } from 'ngx-file-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeSetupComponent } from './employee-setup/employee-setup.component';
import { ChangeStatusConfimationComponent } from './employee-setup/change-status-confimation/change-status-confimation.component';
import { BulkImportComponent } from './employee-setup/bulk-import/bulk-import.component';
import { AddOneEmployeeComponent } from './employee-setup/add-one-employee/add-one-employee.component';
import { OthesInformationTabComponent } from './employee-setup/othes-information-tab/othes-information-tab.component';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

const routes: Routes = [
    {
        path: '',
        component: EmployeeSetupComponent

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
        MatAutocompleteModule,
        NgbModule,
        NgbTimepickerModule,
        NgxMaterialTimepickerModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [DeleteListConfirmationComponent, DateDialogComponent,
        ChangeStatusConfimationComponent],
    declarations: [EmployeeSetupComponent, DeleteListConfirmationComponent,
        DateDialogComponent, BulkImportComponent, AddOneEmployeeComponent,
        ChangeStatusConfimationComponent, OthesInformationTabComponent]
})
export class AdminInvitesModule { }
