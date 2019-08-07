import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-add-remark',
    templateUrl: 'add-remark.page.html',
})
export class AddRemarkPage {

    constructor(
        public dialogRef: MatDialogRef<AddRemarkPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}