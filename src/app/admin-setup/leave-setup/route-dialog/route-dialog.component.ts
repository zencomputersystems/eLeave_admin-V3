import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * dialog for routing alert
 * @export
 * @class RouteDialogComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-route-dialog',
    templateUrl: './route-dialog.component.html',
    styleUrls: ['./route-dialog.component.scss']
})
export class RouteDialogComponent implements OnInit {

    /**
     *Creates an instance of RouteDialogComponent.
     * @param {MatDialogRef<RouteDialogComponent>} dialog
     * @param {*} data
     * @memberof RouteDialogComponent
     */
    constructor(public dialog: MatDialogRef<RouteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    /**
     * initial method
     * @memberof RouteDialogComponent
     */
    ngOnInit() {
    }

    /**
     * click button to close dialog
     * @memberof RouteDialogComponent
     */
    close(): void {
        this.dialog.close();
    }

}
