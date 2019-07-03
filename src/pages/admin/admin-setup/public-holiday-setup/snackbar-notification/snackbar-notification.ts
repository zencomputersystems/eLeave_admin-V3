import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
/**
 * Show notification after submit
 * @export
 * @class SnackbarNotificationPage
 */
@Component({
  selector: 'app-snackbar-notification',
  templateUrl: './snackbar-notification.html',
  styles: [`
      .alertSuccess {
        color: #48c353;
      }
      .alertFail{
          color: #bdbdbd;
      }
    `],
})
export class SnackbarNotificationPage {

  /**
   *Creates an instance of NotificationPage.
   * @param {*} data
   * @memberof NotificationPage
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {

  }
}