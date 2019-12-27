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
    styleUrls: ['delete-calendar-confirmation.component.scss'],
})
export class DeleteCalendarConfirmationComponent {

    /**
     *Creates an instance of DeleteCalendarConfirmationComponent.
     * @param {MatDialogRef<DeleteCalendarConfirmationComponent>} dialog reference to a dialog opened
     * @param {*} data get data from inject component
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