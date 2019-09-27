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
  styles: [`
      .alertSuccess {
        color: #48c353;
      }
      .alertFail{
          color: #bdbdbd;
      }
    `],
})
export class SnackbarNotificationComponent {

  /**
   *Creates an instance of SnackbarNotificationComponent.
   * @param {*} data
   * @memberof SnackbarNotificationComponent
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {

  }
}