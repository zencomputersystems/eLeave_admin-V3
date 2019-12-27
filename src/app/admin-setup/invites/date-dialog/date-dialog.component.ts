import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * pop up date selection
 * @export
 * @class DateDialogComponent
 */
@Component({
    selector: 'date-dialog',
    templateUrl: 'date-dialog.component.html',
    styleUrls: ['./date-dialog.component.scss'],

})
export class DateDialogComponent {

    /**
     * date selected
     * @type {Date}
     * @memberof DateDialogComponent
     */
    public date: Date;

    /**
     *Creates an instance of DateDialogComponent.
     * @param {MatDialogRef<DateDialogComponent>} dialog reference to a dialog opened
     * @param {*} data get from inject component
     * @memberof DateDialogComponent
     */
    constructor(
        public dialog: MatDialogRef<DateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /**
     * click cancel to close pop up dialog
     * @memberof DateDialogComponent
     */
    cancelClick(): void {
        this.dialog.close();
    }


    /** 
     * get selected date value from datepicker
     * @param {*} event
     * @memberof DateDialogComponent
     */
    expirationDateChange(event) {
        this.date = event.value;
    }

}