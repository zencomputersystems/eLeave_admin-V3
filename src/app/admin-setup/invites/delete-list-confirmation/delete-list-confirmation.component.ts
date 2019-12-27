import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * Delete invite name list confirmation pop up
 * @export
 * @class DeleteListConfirmationComponent
 */
@Component({
    selector: 'delete-list-confirmation',
    templateUrl: 'delete-list-confirmation.component.html',
})
export class DeleteListConfirmationComponent {

    /**
     *Creates an instance of DeleteListConfirmationComponent.
     * @param {MatDialogRef<DeleteListConfirmationComponent>} dialog reference to a dialog opened
     * @param {*} data get data from inject component
     * @memberof DeleteListConfirmationComponent
     */
    constructor(
        public dialog: MatDialogRef<DeleteListConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click cancel to close pop up dialog
     * @memberof DeleteListConfirmationComponent
     */
    cancelClick(): void {
        this.dialog.close();
    }

}