import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
/**
 * Bulk Import Success Page
 * @export
 * @class BulkImportSuccessComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-bulk-import-success',
    templateUrl: './bulk-import-success.component.html',
    styleUrls: ['./bulk-import-success.component.scss'],
})
export class BulkImportSuccessComponent implements OnInit {

    /**
     * Loading spinner style name
     * @memberof BulkImportSuccessComponent
     */
    public spinnerName = "dots";

    /**
     * Show or hide spinner
     * @memberof BulkImportSuccessComponent
     */
    public showSpinner = true;

    /**
     *Creates an instance of BulkImportSuccessComponent.
     * @param {MatDialogRef<BulkImportSuccessComponent>} dialogRef
     * @memberof BulkImportSuccessComponent
     */
    constructor(public dialogRef: MatDialogRef<BulkImportSuccessComponent>,
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.dialogRef.close();
        }, 3000);
    }

}
