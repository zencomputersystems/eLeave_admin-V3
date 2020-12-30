import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * dialog for uploaded users 
 * @export
 * @class UploadAttendanceConfirmationComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-upload-attendance-confirmation',
    templateUrl: './upload-attendance-confirmation.component.html',
    styleUrls: ['./upload-attendance-confirmation.component.scss']
})
export class UploadAttendanceConfirmationComponent implements OnInit {

    /**
     *Creates an instance of UploadAttendanceConfirmationComponent.
     * @param {MatDialogRef<UploadAttendanceConfirmationComponent>} dialog reference to a dialog opened
     * @param {*} data data get from inject component
     * @memberof UploadAttendanceConfirmationComponent
     */
    constructor(public dialog: MatDialogRef<UploadAttendanceConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    /**
     * initial method
     * @memberof UploadAttendanceConfirmationComponent
     */
    ngOnInit() {
    }

    /**
     * click button to close dialog
     * @memberof UploadAttendanceConfirmationComponent
     */
    close(): void {
        this.dialog.close();
    }

}
