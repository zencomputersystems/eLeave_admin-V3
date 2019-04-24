import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BulkImportPage } from './bulk-import/bulk-import.page';

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.page.html',
    styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {

    }

    openBulkImport() {
        const dialogRef = this.dialog.open(BulkImportPage, {
            // width: '250px',
            // data: { name: this.name, animal: this.animal }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }
}


