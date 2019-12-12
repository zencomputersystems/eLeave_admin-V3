import { Component, OnInit } from '@angular/core';
import { LeaveApiService } from '../leave-api.service';
import { LeaveEntitlementApiService } from './leave-entitlement-api.service';
import { MatDialog } from '@angular/material';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';

@Component({
  selector: 'app-leave-entitlement',
  templateUrl: './leave-entitlement.component.html',
  styleUrls: ['./leave-entitlement.component.scss']
})
export class LeaveEntitlementComponent implements OnInit {

  public listEntitlement: any;
  public leavetypeID: string[];
  public leaveTypes: string[] = [];
  public leaveEntitlement: any[];
  public mainToggle: string = 'OFF';
  public clickedIndex: number;
  public clickedHeaderIndex: number;
  public leaveContent: boolean[] = [];

  constructor(private entitlementApi: LeaveEntitlementApiService, private leaveApi: LeaveApiService, private dialog: MatDialog) { }

  async ngOnInit() {
    this.leaveTypes = [];
    this.clickedIndex = 0;
    this.clickedHeaderIndex = 0;
    let data = await this.leaveApi.get_leavetype_entitlement().toPromise();
    this.listEntitlement = data;
    let grouppedId = require('lodash').groupBy(this.listEntitlement, 'leaveTypeId');
    this.leaveEntitlement = Object.values(grouppedId);
    let ids = Object.keys(grouppedId);
    for (let i = 0; i < ids.length; i++) {
      this.leaveContent.push(false);
      let details = await this.entitlementApi.get_admin_leavetype_id(ids[i]).toPromise();
      this.leaveTypes.push(details.ABBR + ' - ' + details.CODE);
    }
    this.leaveContent.splice(0, 1, true);
    for (let i = 0; i < this.listEntitlement.length; i++) {
      this.getProfileDetails(this.listEntitlement[i].leaveEntitlementId);
    }
  }

  async getProfileDetails(entitledId: string) {
    let details = await this.entitlementApi.get_leavetype_entitlement_id(entitledId).toPromise();
    console.log(details);
  }

  clickedEntitlement(item: any, i: number, j: number) {
    this.clickedIndex = i;
    this.clickedHeaderIndex = j;
    console.log(item);
    this.getProfileDetails(item.leaveEntitlementId);
  }

  showClickedContent(index: number) {
    for (let i = 0; i < this.leaveContent.length; i++) {
      this.leaveContent.splice(i, 1, false);
    }
    this.leaveContent.splice(index, 1, true);
    // this.leaveContent.splice();
  }

  toggleMain(evt) {
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
