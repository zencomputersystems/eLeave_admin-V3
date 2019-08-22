import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * Delete invite name list confirmation pop up
 * @export
 * @class DeleteCalendarConfirmationPage
 */
@Component({
    selector: 'delete-calendar-confirmation',
    templateUrl: 'delete-calendar-confirmation.page.html',
})
export class DeleteCalendarConfirmationPage {

    /**
     *Creates an instance of DeleteCalendarConfirmationPage.
     * @param {MatDialogRef<DeleteCalendarConfirmationPage>} dialog
     * @param {*} data
     * @memberof DeleteCalendarConfirmationPage
     */
    constructor(
        public dialog: MatDialogRef<DeleteCalendarConfirmationPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click cancel to close pop up dialog
     * @memberof DeleteCalendarConfirmationPage
     */
    cancel(): void {
        this.dialog.close();
    }

}