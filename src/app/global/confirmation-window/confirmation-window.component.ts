import { PopoverController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

/**
 * This component is to set confirmation popup for reset default profile
 * @export
 * @class ConfirmationWindowComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-confirmation-window',
  templateUrl: './confirmation-window.component.html',
  styleUrls: ['./confirmation-window.component.scss']
})
export class ConfirmationWindowComponent implements OnInit {

  /**
   * Profile type
   * @memberof ConfirmationWindowComponent
   */
  @Input() type;

  /**
   * Current default profile data
   * @memberof ConfirmationWindowComponent
   */
  @Input() currDefaultProfile;

  /**
   * Default profile to be data
   * @memberof ConfirmationWindowComponent
   */
  @Input() newDefaultProfile;

  /**
   * Creates an instance of ConfirmationWindowComponent.
   * @param {PopoverController} cwPopoverController
   * @memberof ConfirmationWindowComponent
   */
  constructor(private cwPopoverController: PopoverController) { }

  /**
   * This method is initilization for this component
   * @memberof ConfirmationWindowComponent
   */
  ngOnInit() {
  }

  /**
   * This method will pass value if user click no button 
   * @returns
   * @memberof ConfirmationWindowComponent
   */
  async onCancelReassign() {
    return await this.cwPopoverController.dismiss(false);
  }

  /**
   * This method will pass value if user click yes button
   * @returns
   * @memberof ConfirmationWindowComponent
   */
  async onConfirmReassign() {
    return await this.cwPopoverController.dismiss(true);
  }
}
