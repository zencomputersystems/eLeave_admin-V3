import { Component, OnInit } from '@angular/core';
import { LeaveApiService } from '../leave-api.service';
import { LeaveEntitlementApiService } from './leave-entitlement-api.service';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { DeleteCalendarConfirmationComponent } from '../delete-calendar-confirmation/delete-calendar-confirmation.component';
import { MenuController } from '@ionic/angular';
import { Validators, FormControl } from '@angular/forms';
import { entitlementData } from './leave-entitlement-data';

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
  public leaveTypes: any[] = [];

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
     * selected new button or not
     * @type {boolean}
     * @memberof LeaveEntitlementComponent
     */
  public newButton: boolean = true;

  /**
   * selected clone button or not
   * @type {boolean}
   * @memberof LeaveEntitlementComponent
   */
  public cloneButton: boolean = false;

  /**
   * list of all leave type
   * @type {*}
   * @memberof LeaveEntitlementComponent
   */
  // public leaveTypeList: any;

  /**
   * clone profile leave entitlement id
   * @type {string}
   * @memberof LeaveEntitlementComponent
   */
  public cloneProfileId: string;

  /**
   * leave type id
   * @type {string}
   * @memberof LeaveEntitlementComponent
   */
  public entitlementTypeNew: string;

  /**
   * add new leave type name form control
   * @type {*}
   * @memberof LeaveEntitlementComponent
   */
  public leaveTypeName: any;

  /**
   * add new abbreviation
   * @type {*}
   * @memberof LeaveEntitlementComponent
   */
  public abbreviation: any;

  /**
   * abbreviation term of leave type
   * @type {string}
   * @memberof LeaveEntitlementComponent
   */
  public abbr: string;

  /**
   * name of leave type
   * @type {string}
   * @memberof LeaveEntitlementComponent
   */
  public name: string;

  /**
   * new leave type id 
   * @type {string}
   * @memberof LeaveEntitlementComponent
   */
  public newLeaveTypeId: string;

  /**
   * list of new entitlement profile
   * @memberof LeaveEntitlementComponent
   */
  public newProfileList = [{ 'name': 'Default', 'description': 'Default Leave Entitlement' }];

  /**
   *Creates an instance of LeaveEntitlementComponent.
   * @param {LeaveEntitlementApiService} entitlementApi
   * @param {LeaveApiService} leaveApi
   * @param {MenuController} menu
   * @memberof LeaveEntitlementComponent
   */
  constructor(private entitlementApi: LeaveEntitlementApiService, private leaveApi: LeaveApiService, private menu: MenuController) {
    this.abbreviation = new FormControl('', Validators.required);
    this.leaveTypeName = new FormControl('', Validators.required);
  }

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
    console.log(this.leaveEntitlement);
    this.getLeaveTypes(grouppedId);
    this.leaveContent.splice(0, 1, true);
    this.getProfileDetails(data[0].leaveEntitlementId);
    // this.getLeaveTypeList();
  }

  addNewProfileItem() {
    const obj = { 'name': '', 'description': '' }
    this.newProfileList.push(obj);
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
      console.log(details);
      this.leaveTypes.push({ "leaveTypeId": details.LEAVE_TYPE_GUID, "title": details.ABBR + ' - ' + details.CODE, "ABBR": details.ABBR, "name": details.CODE });
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
      let value = [this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement];
      this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement = value;
    }
  }

  /**
   * get leave types list
   * @memberof LeaveEntitlementComponent
   */
  // getLeaveTypeList() {
  //   this.leaveApi.get_admin_leavetype().subscribe(data => {
  //     this.leaveTypeList = data;
  //   });
  // }

  addNewLevel() {
    const levelObj = {
      "id": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length + 1,
      "serviceYearFrom": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement[this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length - 1].serviceYearTo + 1,
      "serviceYearTo": 100,
      "entitledDays": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement[this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length - 1].entitledDays + 1, "carryForward": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement[this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length - 1].carryForward + 1
    };
    this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.push(levelObj);
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

  deleteProfile(index) {
    this.newProfileList.splice(index, 1);
    console.log(this.newProfileList);
  }

  /**
   * toggle button edit mode value
   * @param {*} evt
   * @memberof LeaveEntitlementComponent
   */
  toggleMain(evt: any) {
    if (evt.detail.checked === true) {
      this.mainToggle = 'ON';
      this.entitlementApi.dialog.open(EditModeDialogComponent, {
        data: 'entitlement',
        height: "372.3px",
        width: "383px"
      });
    } else {
      this.mainToggle = 'OFF'
      // only save selected profile 
      const data = {
        "id": this.entitlementDetails.ENTITLEMENT_GUID,
        "code": "Annual Leave",
        "description": "Annual leave for junior executive",
        "property": this.entitlementDetails.PROPERTIES_XML
      };
      this.entitlementApi.patch_leavetype_entitlement(data).subscribe(data => {
        this.ngOnInit();
        this.leaveApi.openSnackBar('Edit mode disabled. Good job!', true);
      })
    }
  }

  /**
   * create new type
   * @memberof LeaveEntitlementComponent
   */
  newLeaveType() {
    const content = {
      "abbr": this.abbreviation.value,
      "code": this.leaveTypeName.value,
      "description": this.leaveTypeName.value
    }
    this.entitlementApi.post_leavetype(content).subscribe(res => {
      console.log(res.resource[0].LEAVE_TYPE_GUID);
      this.newLeaveTypeId = res.resource[0].LEAVE_TYPE_GUID;
    })
  }

  /**
     * create new/clone entitlement profile
     * @param {string} buttonName
     * @memberof LeaveEntitlementComponent
     */
  async createProfile(buttonName: string) {
    let data;
    if (buttonName == 'new') {
      for (let i = 0; i < this.newProfileList.length; i++) {
        data = entitlementData;
        data.leavetype_id = this.newLeaveTypeId;
        data.code = this.newProfileList[i].name;
        data.description = this.newProfileList[i].description;
        await this.entitlementApi.post_leavetype_entitlement(data).toPromise();
      }
      this.ngOnInit();
      this.newLeaveTypeId = '';
      this.leaveApi.openSnackBar('New leave entitlement profile was added', true);
      this.menu.close('createNewTypeDetails');
      this.menu.close('editLeaveTypeDetails');
    } else {
      let value = await this.entitlementApi.get_leavetype_entitlement_id(this.cloneProfileId).toPromise();
      data = {
        "code": value.LEAVE_ENTITLEMENT_CODE,
        "description": value.DESCRIPTION,
        "leavetype_id": this.entitlementTypeNew,
        "property": value.PROPERTIES_XML
      };
      this.entitlementApi.post_leavetype_entitlement(data).subscribe(res => {
        this.ngOnInit();
        this.newLeaveTypeId = '';
        this.leaveApi.openSnackBar('New leave entitlement profile was added', true);
        this.menu.close('createNewTypeDetails');
        this.menu.close('editLeaveTypeDetails');
      })
    }
  }

  /**
   * delete leave entitlement profile
   * @param {string} leaveEntitlementId
   * @param {string} leavetype
   * @param {string} code
   * @memberof LeaveEntitlementComponent
   */
  deleteLeaveEntitlement(leaveEntitlementId: string, leavetype: string, code: string) {
    const dialogRef = this.entitlementApi.dialog.open(DeleteCalendarConfirmationComponent, {
      data: { name: leavetype + ' - ' + code, value: leaveEntitlementId, desc: ' entitlement profile' },
      height: "195px",
      width: "270px"
    });
    dialogRef.afterClosed().subscribe(val => {
      if (val === leaveEntitlementId) {
        this.entitlementApi.delete_leavetype_entitlement(leaveEntitlementId).subscribe(res => {
          this.ngOnInit();
          this.leaveApi.openSnackBar('Leave entitlement profile was deleted', true);
        });
      }
    });
  }

}
