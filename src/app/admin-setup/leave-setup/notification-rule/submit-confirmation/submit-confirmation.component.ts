import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

/**
 * dialog for edit mode alert
 * @export
 * @class SubmitConfirmationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-submit-confirmation',
  templateUrl: './submit-confirmation.component.html',
  styleUrls: ['./submit-confirmation.component.scss']
})
export class SubmitConfirmationComponent implements OnInit {

  /**
   *Creates an instance of SubmitConfirmationComponent.
   * @param {MatDialogRef<SubmitConfirmationComponent>} dialog reference to a dialog opened
   * @param {*} data data get from inject component
   * @memberof SubmitConfirmationComponent
   */
  constructor(public dialog: MatDialogRef<SubmitConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * initial method
   * @memberof SubmitConfirmationComponent
   */
  ngOnInit() {
  }

  /**
   * click button to close dialog
   * @memberof SubmitConfirmationComponent
   */
  close(): void {
    this.dialog.close();
  }

}
