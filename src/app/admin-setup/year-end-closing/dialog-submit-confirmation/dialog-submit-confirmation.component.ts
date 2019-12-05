import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-submit-confirmation',
  templateUrl: './dialog-submit-confirmation.component.html',
  styleUrls: ['./dialog-submit-confirmation.component.scss']
})
export class DialogSubmitConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogSubmitConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

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
