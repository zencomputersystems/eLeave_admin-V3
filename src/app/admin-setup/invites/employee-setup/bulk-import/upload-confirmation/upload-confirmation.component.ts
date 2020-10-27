import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * dialog for uploaded users 
 * @export
 * @class UploadConfirmationComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-upload-confirmation',
    templateUrl: './upload-confirmation.component.html',
    styleUrls: ['./upload-confirmation.component.scss']
})
export class UploadConfirmationComponent implements OnInit {

    /**
     *Creates an instance of UploadConfirmationComponent.
     * @param {MatDialogRef<UploadConfirmationComponent>} dialog reference to a dialog opened
     * @param {*} data data get from inject component
     * @memberof UploadConfirmationComponent
     */
    constructor(public dialog: MatDialogRef<UploadConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    /**
     * initial method
     * @memberof UploadConfirmationComponent
     */
    ngOnInit() {
    }

    /**
     * click button to close dialog
     * @memberof UploadConfirmationComponent
     */
    close(): void {
        this.dialog.close();
    }

}
