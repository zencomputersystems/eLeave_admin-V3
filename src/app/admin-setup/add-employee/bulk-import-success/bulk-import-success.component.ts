import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
/**
 * Bulk Import Success Page
 * @export
 * @class BulkImportSuccessPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-bulk-import-success',
    templateUrl: './bulk-import-success.component.html',
    styleUrls: ['./bulk-import-success.component.scss'],
})
export class BulkImportSuccessPage implements OnInit {

    /**
     * Loading spinner style name
     * @memberof BulkImportSuccessPage
     */
    public spinnerName = "dots";

    /**
     * Show or hide spinner
     * @memberof BulkImportSuccessPage
     */
    public showSpinner = true;

    /**
     *Creates an instance of BulkImportSuccessPage.
     * @param {MatDialogRef<BulkImportSuccessPage>} dialogRef
     * @memberof BulkImportSuccessPage
     */
    constructor(public dialogRef: MatDialogRef<BulkImportSuccessPage>,
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.dialogRef.close();
        }, 3000);
    }

}
