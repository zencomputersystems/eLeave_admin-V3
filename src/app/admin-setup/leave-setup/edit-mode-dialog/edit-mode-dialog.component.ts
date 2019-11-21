import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * dialog for edit mode alert
 * @export
 * @class EditModeDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-edit-mode-dialog',
  templateUrl: './edit-mode-dialog.component.html',
  styleUrls: ['./edit-mode-dialog.component.scss']
})
export class EditModeDialogComponent implements OnInit {

  /**
   *Creates an instance of EditModeDialogComponent.
   * @param {MatDialogRef<EditModeDialogComponent>} dialog
   * @param {*} data
   * @memberof EditModeDialogComponent
   */
  constructor(public dialog: MatDialogRef<EditModeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * initial method
   * @memberof EditModeDialogComponent
   */
  ngOnInit() {
  }

  /**
   * click button to close dialog
   * @memberof EditModeDialogComponent
   */
  close(): void {
    this.dialog.close();
  }

}
