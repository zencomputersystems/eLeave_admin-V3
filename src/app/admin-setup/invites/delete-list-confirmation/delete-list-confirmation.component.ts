import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * Delete invite name list confirmation pop up
 * @export
 * @class DeleteListConfirmationPage
 */
@Component({
    selector: 'delete-list-confirmation',
    templateUrl: 'delete-list-confirmation.component.html',
})
export class DeleteListConfirmationPage {

    /**
     *Creates an instance of DeleteListConfirmationPage.
     * @param {MatDialogRef<DeleteListConfirmationPage>} dialog
     * @param {*} data
     * @memberof DeleteListConfirmationPage
     */
    constructor(
        public dialog: MatDialogRef<DeleteListConfirmationPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click cancel to close pop up dialog
     * @memberof DeleteListConfirmationPage
     */
    cancelClick(): void {
        this.dialog.close();
    }

}