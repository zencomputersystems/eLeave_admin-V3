import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
/**
 * Show notification after submit
 * @export
 * @class SnackbarNotificationComponent
 */
@Component({
  selector: 'app-snackbar-notification',
  templateUrl: './snackbar-notification.component.html',
  styleUrls: ['./snackbar-notification.component.scss']
})

export class SnackbarNotificationComponent {

  /**
   *Creates an instance of SnackbarNotificationComponent.
   * @param {*} data get data from inject component
   * @memberof SnackbarNotificationComponent
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  /**
   * initial method
   * @memberof SnackbarNotificationComponent
   */
  ngOnInit() {

  }
}