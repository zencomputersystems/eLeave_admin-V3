import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/**
 * dialog confirmation page
 * @export
 * @class DialogSubmitConfirmationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-dialog-submit-confirmation',
  templateUrl: './dialog-submit-confirmation.component.html',
  styleUrls: ['./dialog-submit-confirmation.component.scss']
})
export class DialogSubmitConfirmationComponent implements OnInit {

  /**
   *Creates an instance of DialogSubmitConfirmationComponent.
   * @param {MatDialogRef<DialogSubmitConfirmationComponent>} dialogRef reference to a dialog opened
   * @param {*} data data get from inject component
   * @memberof DialogSubmitConfirmationComponent
   */
  constructor(public dialogRef: MatDialogRef<DialogSubmitConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * initial method
   * @memberof DialogSubmitConfirmationComponent
   */
  ngOnInit() {
  }

  /**
     * click on cancel button to close pop up dialog
     * @memberof DialogSubmitConfirmationComponent
     */
  onCancelClick(): void {
    this.dialogRef.close();
  }

}
