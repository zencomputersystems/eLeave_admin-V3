import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LeaveEntitlementApiService } from './leave-entitlement-api.service';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { DeleteCalendarConfirmationComponent } from '../delete-calendar-confirmation/delete-calendar-confirmation.component';
import { Validators, FormControl } from '@angular/forms';
import { entitlementData } from './leave-entitlement-data';
import { SharedService } from '../shared.service';

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
  public clickedIndex: number = 0;

  /**
   * clicked index of leave type header
   * @type {number}
   * @memberof LeaveEntitlementComponent
   */
  public clickedHeaderIndex: number = 0;

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
  public newProfileList = { 'name': 'Default', 'description': 'Default Leave Entitlement' };

  /**
   * edit leave entitlement profile list
   * @memberof LeaveEntitlementComponent
   */
  public newEditProfileList = [];

  /**
   * entitlement list according edit menu (opened selected menu)
   * @memberof LeaveEntitlementComponent
   */
  public getEntitlementbyType = [];

  /**
   * show loading spinner
   * @type {boolean}
   * @memberof LeaveEntitlementComponent
   */
  public showSpinner: boolean = true;

  /**
   * small loading spinner
   * @type {boolean}
   * @memberof LeaveEntitlementComponent
   */
  public showSmallSpinner: boolean;

  /**
   * small loading spinner for add button
   * @type {boolean}
   * @memberof LeaveEntitlementComponent
   */
  public showSmallSpinnerAdd: boolean;

  /**
   *Creates an instance of LeaveEntitlementComponent.
   * @param {LeaveEntitlementApiService} entitlementApi
   * @param {SharedService} sharedService
   * @param {Platform} leaveEntitlementPlatform
   * @memberof LeaveEntitlementComponent
   */
  constructor(private entitlementApi: LeaveEntitlementApiService, private sharedService: SharedService, public leaveEntitlementPlatform: Platform) {
    this.abbreviation = new FormControl('', Validators.required);
    this.leaveTypeName = new FormControl('', Validators.required);
  }

  /**
   * initial method to get value from API
   * @memberof LeaveEntitlementComponent
   */
  async ngOnInit() {
    this.leaveTypes = [];
    let data = await this.sharedService.leaveApi.get_leavetype_entitlement().toPromise();
    this.showSpinner = false;
    let grouppedId = require('lodash').groupBy(data, 'leaveTypeId');
    this.leaveEntitlement = Object.values(grouppedId);
    for (let i = 0; i < this.leaveEntitlement.length; i++) {
      this.leaveTypes.push({ "leaveTypeId": this.leaveEntitlement[i][0].leaveTypeId, "title": this.leaveEntitlement[i][0].leaveTypeAbbr + ' - ' + this.leaveEntitlement[i][0].leaveType, "ABBR": this.leaveEntitlement[i][0].leaveTypeAbbr, "name": this.leaveEntitlement[i][0].leaveType });
    }
    this.showClickedContent(this.clickedHeaderIndex);
    if (this.leaveEntitlement[this.clickedHeaderIndex][this.clickedIndex] == undefined) {
      this.clickedIndex = 0;
    }
    this.getProfileDetails(this.leaveEntitlement[this.clickedHeaderIndex][this.clickedIndex].leaveEntitlementId);
    console.log('leaveEntitlementPlatform: ' + this.leaveEntitlementPlatform.is('desktop' || 'electron'));
  }

  /**
   * get clicked entitlement profile details
   * @param {string} entitledId
   * @memberof LeaveEntitlementComponent
   */
  async getProfileDetails(entitledId: string) {
    this.entitlementDetails = await this.entitlementApi.get_leavetype_entitlement_id(entitledId).toPromise();
    if (this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length == undefined) {
      let value = [this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement];
      this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement = value;
    }
  }

  /**
   * add or delete level object
   * @memberof LeaveEntitlementComponent
   */
  addDeleteLevel(action: string, index?: number) {
    if (action == 'add') {
      const levelObj = {
        "id": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length + 1,
        "serviceYearFrom": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement[this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length - 1].serviceYearTo + 1,
        "serviceYearTo": 100,
        "entitledDays": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement[this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length - 1].entitledDays + 1, "carryForward": this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement[this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.length - 1].carryForward + 1
      };
      this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.push(levelObj);
    } else {
      this.entitlementDetails.PROPERTIES_XML.levels.leaveEntitlement.splice(index, 1);
    }
  }

  /**
   * show content of entitlement from clicked header
   * @param {number} index
   * @memberof LeaveEntitlementComponent
   */
  showClickedContent(index: number) {
    this.leaveContent = [];
    this.leaveContent.push(...Array(this.leaveEntitlement.length).fill(false));
    this.leaveContent.splice(index, 1, true);
  }

  /**
   * delete name & description input form
   * @param {string} menu
   * @param {number} index
   * @memberof LeaveEntitlementComponent
   */
  AddDeleteProfile(actionName: string, index?: number) {
    if (actionName == 'add') {
      const obj = { 'name': '', 'description': '' };
      this.newEditProfileList.push(obj);
    } else {
      this.newEditProfileList.splice(index, 1);
    }
  }

  /**
   * patch & post leave entitlement profile
   * @memberof LeaveEntitlementComponent
   */
  saveCreateProfile() {
    for (let i = 0; i < this.leaveEntitlement.length; i++) {
      for (let j = 0; j < this.leaveEntitlement[i].length; j++) {
        if (this.leaveEntitlement[i][j].leaveTypeId == this.entitlementTypeNew) {
          this.getEntitlementbyType = this.leaveEntitlement[i];
        }
      }
    }
    this.addEditProfile();
  }

  /**
   * update entitlement profile details
   * @memberof LeaveEntitlementComponent
   */
  async patchProfile() {
    for (let j = 0; j < this.getEntitlementbyType.length; j++) {
      let XMLDetails = await this.entitlementApi.get_leavetype_entitlement_id(this.getEntitlementbyType[j].leaveEntitlementId).toPromise();
      const data = {
        "id": this.getEntitlementbyType[j].leaveEntitlementId,
        "code": this.getEntitlementbyType[j].leaveEntitlementCode,
        "description": this.getEntitlementbyType[j].leaveEntitlementDescription,
        "property": XMLDetails.PROPERTIES_XML
      };
      try {
        await this.entitlementApi.patch_leavetype_entitlement(data).toPromise();
        this.showSmallSpinner = false;
        this.sharedService.menu.close('editLeaveTypeDetails');
        this.sharedService.leaveApi.openSnackBar('Leave type & entitlement was saved', true);
      } catch (err) {
        this.sharedService.leaveApi.openSnackBar(err.statusText, false);
      }
    }
    this.ngOnInit();
  }

  /**
   * add entitlement profile in edit menu
   * @memberof LeaveEntitlementComponent
   */
  async addEditProfile() {
    let value;
    for (let i = 0; i < this.newEditProfileList.length; i++) {
      value = entitlementData;
      value.leavetype_id = this.entitlementTypeNew;
      value.code = this.newEditProfileList[i].name;
      value.description = this.newEditProfileList[i].description;
      try {
        await this.entitlementApi.post_leavetype_entitlement(value).toPromise();
      } catch (error) {
        this.sharedService.leaveApi.openSnackBar(error.statusText, false);
      }
    }
    this.newEditProfileList = [];
    const data = {
      "abbr": this.abbr,
      "code": this.name,
      "description": this.name,
      "id": this.entitlementTypeNew
    }
    try { await this.entitlementApi.patch_leavetype(data).toPromise(); }
    catch (res) {
      this.sharedService.leaveApi.openSnackBar(res.statusText, false);
    }
    this.patchProfile();
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
        disableClose: true,
        data: 'entitlement',
        height: "372.3px",
        width: "383px"
      });
    } else {
      this.mainToggle = 'OFF'
      // only save selected profile 
      const data = {
        "id": this.entitlementDetails.ENTITLEMENT_GUID,
        "code": this.entitlementDetails.LEAVE_ENTITLEMENT_CODE,
        "description": this.entitlementDetails.DESCRIPTION,
        "property": this.entitlementDetails.PROPERTIES_XML
      };
      this.entitlementApi.patch_leavetype_entitlement(data).subscribe(data => {
        this.ngOnInit();
        this.sharedService.leaveApi.openSnackBar('Edit mode disabled. Good job!', true);
      }, err => this.sharedService.leaveApi.openSnackBar(err.statusText, false))
    }
    this.sharedService.emitChange(this.mainToggle);
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
      this.newLeaveTypeId = res.resource[0].LEAVE_TYPE_GUID;
      this.showSmallSpinner = false;
    }, errorRes => this.sharedService.leaveApi.openSnackBar(errorRes.statusText, false))
  }

  /**
     * create new/clone entitlement profile
     * @param {string} buttonName
     * @memberof LeaveEntitlementComponent
     */
  async createProfile(buttonName: string) {
    let data;
    if (buttonName == 'new') {
      this.newTypeEntitlement(data);
    } else {
      let value = await this.entitlementApi.get_leavetype_entitlement_id(this.cloneProfileId).toPromise();
      data = {
        "code": value.LEAVE_ENTITLEMENT_CODE + ' (copy)',
        "description": value.DESCRIPTION,
        "leavetype_id": this.entitlementTypeNew,
        "property": value.PROPERTIES_XML
      };
      this.entitlementApi.post_leavetype_entitlement(data).subscribe(res => {
        this.ngOnInit();
        this.newLeaveTypeId = '';
        this.sharedService.leaveApi.openSnackBar('New leave entitlement profile was added', true);
        this.showSmallSpinner = false;
        this.sharedService.menu.close('editLeaveTypeDetails');
      }, response => {
        this.sharedService.leaveApi.openSnackBar(response.statusText, false);
        this.showSmallSpinner = false;
      })
    }
  }

  /**
   * add new type & entitlement profile
   * @param {*} data
   * @memberof LeaveEntitlementComponent
   */
  async newTypeEntitlement(data) {
    data = entitlementData;
    data.leavetype_id = this.newLeaveTypeId;
    data.code = this.newProfileList.name;
    data.description = this.newProfileList.description;
    try {
      await this.entitlementApi.post_leavetype_entitlement(data).toPromise();
      this.sharedService.leaveApi.openSnackBar('New leave entitlement profile was added', true);
    } catch (err) {
      this.sharedService.leaveApi.openSnackBar(err.statusText, false);
    }
    this.showSmallSpinnerAdd = false;
    this.ngOnInit();
    this.newLeaveTypeId = '';
    this.abbreviation.reset();
    this.leaveTypeName.reset();
    this.newProfileList = { 'name': 'Default', 'description': 'Default Leave Entitlement' };
    this.sharedService.menu.close('createNewTypeDetails');
  }

  /**
   * delete leave type 
   * @memberof LeaveEntitlementComponent
   */
  // async deleteLeaveType(abbr: string, name: string) {
  //   const dialogRef = this.entitlementApi.dialog.open(DeleteCalendarConfirmationComponent, {
  //     data: { name: abbr + ' - ' + name, value: this.entitlementTypeNew, desc: ' leave type' },
  //     height: "230px",
  //     width: "270px"
  //   });
  //   let val = await dialogRef.afterClosed().toPromise();
  //   if (val === this.entitlementTypeNew) {
  //     this.entitlementApi.delete_leavetype(this.entitlementTypeNew).subscribe(res => {
  //       this.sharedService.menu.close('editLeaveTypeDetails');
  //       this.ngOnInit();
  //       this.leaveApi.openSnackBar('Leave type & attached profile was deleted', true);
  //     })
  //   }
  // }

  /**
   * delete leave entitlement profile
   * @param {string} leaveEntitlementId
   * @param {string} leavetype
   * @param {string} code
   * @memberof LeaveEntitlementComponent
   */
  async deleteLeaveEntitlement(leaveEntitlementId: string, leavetype: string, code: string) {
    const dialogRef = this.entitlementApi.dialog.open(DeleteCalendarConfirmationComponent, {
      disableClose: true,
      data: { name: leavetype + ' - ' + code, value: leaveEntitlementId, desc: ' entitlement profile' },
      height: "195px",
      width: "270px"
    });
    let val = await dialogRef.afterClosed().toPromise();
    if (val === leaveEntitlementId) {
      this.entitlementApi.delete_leavetype_entitlement(leaveEntitlementId).subscribe(res => {
        if (res[0].USER_LEAVE_ENTITLEMENT_GUID != undefined) {
          this.sharedService.leaveApi.openSnackBar('Reassign employee to delete this leave entitlement', false);
        } else {
          this.ngOnInit();
          if (this.leaveEntitlement[this.clickedHeaderIndex].length == 1) {
            this.entitlementApi.delete_leavetype(this.entitlementTypeNew).subscribe(res => {
            })
            this.sharedService.menu.close('editLeaveTypeDetails');
            this.clickedHeaderIndex = 0;
            this.clickedIndex = 0;
          }
          this.sharedService.leaveApi.openSnackBar('Leave entitlement profile was deleted', true);
        }
      });
    }
  }

}
