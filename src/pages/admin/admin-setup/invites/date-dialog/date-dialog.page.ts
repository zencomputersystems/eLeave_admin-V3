import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * pop up date selection
 * @export
 * @class DateDialogPage
 */
@Component({
    selector: 'date-dialog',
    templateUrl: 'date-dialog.page.html',
    styleUrls: ['./date-dialog.page.scss'],

})
export class DateDialogPage {

    /**
     * date selected
     * @type {Date}
     * @memberof DateDialogPage
     */
    public date: Date;

    /**
     *Creates an instance of DateDialogPage.
     * @param {MatDialogRef<DateDialogPage>} dialog
     * @param {*} data
     * @memberof DateDialogPage
     */
    constructor(
        public dialog: MatDialogRef<DateDialogPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click cancel to close pop up dialog
     * @memberof DateDialogPage
     */
    cancelClick(): void {
        this.dialog.close();
    }


    /** 
     * get selected date value from datepicker
     * @param {*} event
     * @memberof DateDialogPage
     */
    expirationDateChange(event) {
        this.date = event.value;
    }

}