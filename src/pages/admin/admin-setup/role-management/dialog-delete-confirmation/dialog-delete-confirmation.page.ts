import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * Pop up dialog page
 * @export
 * @class DialogDeleteConfirmationPage
 */
@Component({
    selector: 'dialog-delete-confirmation',
    templateUrl: 'dialog-delete-confirmation.page.html',
    styleUrls: ['./dialog-delete-confirmation.page.scss'],

})
export class DialogDeleteConfirmationPage {

    /**
     *Creates an instance of DialogDeleteConfirmationPage.
     * @param {MatDialogRef<DialogDeleteConfirmationPage>} dialogRef
     * @param {*} data
     * @memberof DialogDeleteConfirmationPage
     */
    constructor(
        public dialogRef: MatDialogRef<DialogDeleteConfirmationPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click on cancel button to close pop up dialog
     * @memberof DialogDeleteConfirmationPage
     */
    onCancelClick(): void {
        this.dialogRef.close();
    }

}