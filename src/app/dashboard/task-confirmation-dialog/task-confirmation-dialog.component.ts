import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * pop up confirmation for task action
 * @export
 * @class TaskConfirmationDialogComponent
 */
@Component({
  selector: 'app-task-confirmation-dialog',
  templateUrl: './task-confirmation-dialog.component.html',
  styleUrls: ['./task-confirmation-dialog.component.scss']
})
export class TaskConfirmationDialogComponent {

  /**
   * approved/ rejected status value
   * @type {string}
   * @memberof TaskConfirmationDialogComponent
   */
  public status: string;

  /**
   * reason input value
   * @type {string}
   * @memberof TaskConfirmationDialogComponent
   */
  public reason: string;

  /**
   *Creates an instance of TaskConfirmationDialogComponent.
   * @param {MatDialogRef<TaskConfirmationDialogComponent>} dialog
   * @param {*} data
   * @memberof TaskConfirmationDialogComponent
   */
  constructor(
    public dialog: MatDialogRef<TaskConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
