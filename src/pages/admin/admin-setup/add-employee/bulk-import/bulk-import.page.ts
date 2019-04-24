import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-bulk-import',
    templateUrl: './bulk-import.page.html',
    styleUrls: ['./bulk-import.page.scss'],
})
export class BulkImportPage implements OnInit {

    constructor(public dialogRef: MatDialogRef<BulkImportPage>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

    }

    onCloseClick(): void {
        this.dialogRef.close();
    }



}
