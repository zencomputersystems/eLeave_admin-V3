import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-bulk-import-success',
    templateUrl: './bulk-import-success.page.html',
    styleUrls: ['./bulk-import-success.page.scss'],
})
export class BulkImportSuccessPage implements OnInit {

    public spinnerName = "dots";
    public showSpinner = true;

    constructor(public dialogRef: MatDialogRef<BulkImportSuccessPage>,
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.dialogRef.close();
        }, 3000);
    }

}
