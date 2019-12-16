import { Component, OnInit } from '@angular/core';
import { LeaveApiService } from '../leave-api.service';
import { LeaveEntitlementApiService } from './leave-entitlement-api.service';
import { MatDialog } from '@angular/material';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
/**
 * Leave entitlement setup page
 * @export
 * @class LeaveEntitlementComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-leave-entitlement',
  templateUrl: './leave-entitlement.component.html',
  styleUrls: ['./leave-entitlement.component.scss']
})
export class LeaveEntitlementComponent implements OnInit {

  /**
   * leave types list
   * @type {string[]}
   * @memberof LeaveEntitlementComponent
   */
  public leaveTypes: string[] = [];

  /**
   * leave entitlement details according leave type groupped
   * @type {any[]}
   * @memberof LeaveEntitlementComponent
   */
  public leaveEntitlement: any[];

  /**
   * toggle button value
   * @type {string}
   * @memberof LeaveEntitlementComponent
   */
  public mainToggle: string = 'OFF';

  /**
   * clicked index of entitlement profile
   * @type {number}
   * @memberof LeaveEntitlementComponent
   */
  public clickedIndex: number;

  /**
   * clicked index of leave type header
   * @type {number}
   * @memberof LeaveEntitlementComponent
   */
  public clickedHeaderIndex: number;

  /**
   * show/hidden of content leave entitlement
   * @type {boolean[]}
   * @memberof LeaveEntitlementComponent
   */
  public leaveContent: boolean[] = [];

  /**
   * entitlement details of selected profile
   * @type {*}
   * @memberof LeaveEntitlementComponent
   */
  public entitlementDetails: any;

  /**
   * click to show content of configuration
   * @type {boolean}
   * @memberof LeaveEntitlementComponent
   */
  public showLeaveType: boolean = true;

  /**
   * level of entitlement
   * @type {number[]}
   * @memberof LeaveEntitlementComponent
   */
  public level: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  /**
   *Creates an instance of LeaveEntitlementComponent.
   * @param {LeaveEntitlementApiService} entitlementApi
   * @param {LeaveApiService} leaveApi
   * @param {MatDialog} dialog
   * @memberof LeaveEntitlementComponent
   */
  constructor(private entitlementApi: LeaveEntitlementApiService, private leaveApi: LeaveApiService, private dialog: MatDialog) { }

  /**
   * initial method to get value from API
   * @memberof LeaveEntitlementComponent
   */
  async ngOnInit() {
    this.leaveTypes = [];
    this.clickedIndex = 0;
    this.clickedHeaderIndex = 0;
    let data = await this.leaveApi.get_leavetype_entitlement().toPromise();
    let grouppedId = require('lodash').groupBy(data, 'leaveTypeId');
    this.leaveEntitlement = Object.values(grouppedId);
    this.getLeaveTypes(grouppedId);
    this.leaveContent.splice(0, 1, true);
    this.getProfileDetails(data[0].leaveEntitlementId);
  }

  /**
   * group leave types from leave entitlement list
   * @param {*} grouppedId
   * @memberof LeaveEntitlementComponent
   */
  async getLeaveTypes(grouppedId: any) {
    let ids = Object.keys(grouppedId);
    for (let i = 0; i < ids.length; i++) {
      this.leaveContent.push(false);
      let details = await this.entitlementApi.get_admin_leavetype_id(ids[i]).toPromise();
      this.leaveTypes.push(details.ABBR + ' - ' + details.CODE);
    }
  }

  /**
   * get clicked entitlement profile details
   * @param {string} entitledId
   * @memberof LeaveEntitlementComponent
   */
  async getProfileDetails(entitledId: string) {
    this.entitlementDetails = await this.entitlementApi.get_leavetype_entitlement_id(entitledId).toPromise();
    console.log(this.entitlementDetails);
    if (this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length == undefined) {
      let a = [this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement];
      this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement = a;
      console.log(this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement);
    }
  }

  /**
   * pass clicked index to get profile details
   * @param {*} item
   * @param {number} i
   * @param {number} j
   * @memberof LeaveEntitlementComponent
   */
  clickedEntitlement(item: any, i: number, j: number) {
    this.clickedIndex = i;
    this.clickedHeaderIndex = j;
    console.log(item);
    this.getProfileDetails(item.leaveEntitlementId);
  }

  /**
   * show content of entitlement from clicked header
   * @param {number} index
   * @memberof LeaveEntitlementComponent
   */
  showClickedContent(index: number) {
    for (let i = 0; i < this.leaveContent.length; i++) {
      this.leaveContent.splice(i, 1, false);
    }
    this.leaveContent.splice(index, 1, true);
  }

  /**
   * toggle button edit mode value
   * @param {*} evt
   * @memberof LeaveEntitlementComponent
   */
  toggleMain(evt: any) {
    if (evt.detail.checked === true) {
      this.mainToggle = 'ON';
      this.dialog.open(EditModeDialogComponent, {
        data: 'entitlement',
        height: "363.3px",
        width: "383px"
      });
    } else {
      this.mainToggle = 'OFF'
      this.leaveApi.openSnackBar('Edit mode disabled. Good job!', true);
    }
  }

}
