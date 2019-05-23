import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styles: [`
      .alert {
        color: #48c353;
      }
    `],
})
export class NotificationPage {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    }

    ngOnInit() {

    }
}