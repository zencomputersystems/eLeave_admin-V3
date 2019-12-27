import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * Pop up dialog page
 * @export
 * @class DialogDeleteConfirmationComponent
 */
@Component({
    selector: 'dialog-delete-confirmation',
    templateUrl: 'dialog-delete-confirmation.component.html',
    styleUrls: ['./dialog-delete-confirmation.component.scss'],

})
export class DialogDeleteConfirmationComponent {

    /**
     *Creates an instance of DialogDeleteConfirmationComponent.
     * @param {MatDialogRef<DialogDeleteConfirmationComponent>} dialogRef reference to a dialog opened
     * @param {*} data get data from inject component
     * @memberof DialogDeleteConfirmationComponent
     */
    constructor(
        public dialogRef: MatDialogRef<DialogDeleteConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click on cancel button to close pop up dialog
     * @memberof DialogDeleteConfirmationComponent
     */
    onCancelClick(): void {
        this.dialogRef.close();
    }

}