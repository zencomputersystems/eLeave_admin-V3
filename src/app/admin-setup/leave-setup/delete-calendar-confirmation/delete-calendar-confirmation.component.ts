import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * Delete invite name list confirmation pop up
 * @export
 * @class DeleteCalendarConfirmationComponent
 */
@Component({
    selector: 'delete-calendar-confirmation',
    templateUrl: 'delete-calendar-confirmation.component.html',
})
export class DeleteCalendarConfirmationComponent {

    /**
     *Creates an instance of DeleteCalendarConfirmationComponent.
     * @param {MatDialogRef<DeleteCalendarConfirmationComponent>} dialog
     * @param {*} data
     * @memberof DeleteCalendarConfirmationComponent
     */
    constructor(
        public dialog: MatDialogRef<DeleteCalendarConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click cancel to close pop up dialog
     * @memberof DeleteCalendarConfirmationComponent
     */
    cancel(): void {
        this.dialog.close();
    }

}