import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * pop up dialog for status changed confirmation
 * @export
 * @class ChangeStatusConfimationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-change-status-confimation',
  templateUrl: './change-status-confimation.component.html',
  styleUrls: ['./change-status-confimation.component.scss']
})
export class ChangeStatusConfimationComponent implements OnInit {

  /**
   *Creates an instance of ChangeStatusConfimationComponent.
   * @param {MatDialogRef<ChangeStatusConfimationComponent>} dialog
   * @param {*} data
   * @memberof ChangeStatusConfimationComponent
   */
  constructor(public dialog: MatDialogRef<ChangeStatusConfimationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * initial method
   * @memberof ChangeStatusConfimationComponent
   */
  ngOnInit() {
  }

  /**
     * click cancel to close pop up dialog
     * @memberof ChangeStatusConfimationComponent
     */
  cancel(): void {
    this.dialog.close();
  }

}
