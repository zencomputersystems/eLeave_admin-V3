import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminInvitesApiService } from '../../admin-invites-api.service';
import { RoleApiService } from '../../../../../../src/app/admin-setup/role-management/role-api.service';

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
   * user role name
   * @type {string}
   * @memberof ChangeStatusConfimationComponent
   */
  public userRole: string;

  /**
   * get working hour profile name
   * @type {string}
   * @memberof ChangeStatusConfimationComponent
   */
  public workingHour: string;

  /**
   * get calendar profile name
   * @type {string}
   * @memberof ChangeStatusConfimationComponent
   */
  public calendar: string;

  /**
   * get leave entitlement (leave type)
   * @type {*}
   * @memberof ChangeStatusConfimationComponent
   */
  public entitlement: any;

  /**
   * user profile details get by userId
   * @type {*}
   * @memberof ChangeStatusConfimationComponent
   */
  public userProfile: any;

  /**
   *Creates an instance of ChangeStatusConfimationComponent.
   * @param {MatDialogRef<ChangeStatusConfimationComponent>} dialog reference to a dialog opened
   * @param {*} data access data from inject component
   * @param {AdminInvitesApiService} API
   * @param {RoleApiService} roleAPI
   * @memberof ChangeStatusConfimationComponent
   */
  constructor(public dialog: MatDialogRef<ChangeStatusConfimationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private API: AdminInvitesApiService, private roleAPI: RoleApiService) { }

  /**
   * initial method
   * @memberof ChangeStatusConfimationComponent
   */
  async ngOnInit() {
    if (this.data.userId != undefined) {
      this.userProfile = await this.API.apiService.get_user_profile_details(this.data.userId).toPromise();
      let roleList = await this.roleAPI.get_role_profile_list().toPromise();
      this.getUser(roleList, this.userProfile);

      let workingList = await this.API.get_working_hour_profile_list().toPromise();
      this.getWorkingHour(workingList, this.userProfile);

      let calendarList = await this.API.get_calendar_profile_list().toPromise();
      this.getCalendar(calendarList, this.userProfile);

      let arr = [];
      for (let i = 0; i < this.userProfile.entitlementDetail.length; i++) {
        arr.push(this.userProfile.entitlementDetail[i].abbr);
      }
      this.entitlement = arr.join();
    }
  }

  /**
   * get role list name
   * @param {*} roleList
   * @param {*} data
   * @memberof ChangeStatusConfimationComponent
   */
  getUser(roleList, data) {
    for (let i = 0; i < roleList.length; i++) {
      if (data.roleId == roleList[i].role_guid) {
        this.userRole = roleList[i].code;
      }
    }
  }

  /**
   * get working hour profile name
   * @param {*} workingList
   * @param {*} data
   * @memberof ChangeStatusConfimationComponent
   */
  getWorkingHour(workingList, data) {
    for (let j = 0; j < workingList.length; j++) {
      if (data.workingHoursId == workingList[j].working_hours_guid) {
        this.workingHour = workingList[j].code;
      }
    }
  }

  /**
   * get calendar profile name
   * @param {*} calendarList
   * @param {*} data
   * @memberof ChangeStatusConfimationComponent
   */
  getCalendar(calendarList, data) {
    for (let j = 0; j < calendarList.length; j++) {
      if (data.calendarId == calendarList[j].calendar_guid) {
        this.calendar = calendarList[j].code;
      }
    }
  }

  /**
     * click cancel to close pop up dialog
     * @memberof ChangeStatusConfimationComponent
     */
  cancel(): void {
    this.dialog.close();
  }

}
