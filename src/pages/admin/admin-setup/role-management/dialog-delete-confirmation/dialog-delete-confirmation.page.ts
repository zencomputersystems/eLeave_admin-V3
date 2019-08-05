import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'dialog-delete-confirmation',
    templateUrl: 'dialog-delete-confirmation.page.html',
})
export class DialogDeleteConfirmationPage {

    constructor(
        public dialogRef: MatDialogRef<DialogDeleteConfirmationPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}