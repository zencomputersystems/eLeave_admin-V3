import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { RoleApiService } from '../role-api.service';
import { options } from '../role-details-data';

/**
 * Manage rights/permission for each role
 * @export
 * @class RoleRightsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-rights',
    templateUrl: './role-rights.component.html',
    styleUrls: ['./role-rights.component.scss'],
})
export class RoleRightsComponent implements OnInit {

    /**
     * show leave setup 
     * @type {boolean}
     * @memberof RoleRightsComponent
     */
    @Input() leaveSetup: boolean = false;

    /**
     * get role id of selected role profile
     * @type {string}
     * @memberof RoleRightsComponent
     */
    @Input() roleID: string;

    /**
     * get the edit mode is OFF/ON
     * @type {string}
     * @memberof RoleRightsComponent
     */
    @Input() editMode: string = 'OFF';


    /**
     * Role details from each roleID 
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public profileDetails: any;

    /**
     * Value of checkbox (either indeterminate or vice versa)
     * @type {boolean[]}
     * @memberof RoleRightsComponent
     */
    public isIndeterminate: boolean[] = [false, false, false];

    /**
     * Value of main checkbox (either true or vice versa)
     * @type {boolean[]}
     * @memberof RoleRightsComponent
     */
    public mainCheckbox: boolean[] = [false, false, false];

    /**
     * Options in select input
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public viewReportList: any;

    /**
     * checked value for all leave setup child in array
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public leaveSetupKey: any;

    /**
     * checked value for all leave management child in array
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public leaveMngtKey: any;

    /**
     * checked value for all profile management child in array
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public profileMngtKey: any;

    /**
     * checked value of view calendar
     * @memberof RoleRightsComponent
     */
    public calendarKey = [];

    /**
     * checked value of view report
     * @memberof RoleRightsComponent
     */
    public reportKey = [];

    /**
     * code, description, property to send to API
     * @private
     * @type {*}
     * @memberof RoleRightsComponent
     */
    private _body: any = {};

    /**
     *Creates an instance of RoleRightsComponent.
     * @param {RoleApiService} roleAPi
     * @param {LocalStorageService} local
     * @memberof RoleRightsComponent
     */
    constructor(private roleAPi: RoleApiService, public local: LocalStorageService) {
        this.viewReportList = options;
    }

    /**
     * initial method to get route
     * @memberof RoleRightsComponent
     */
    ngOnInit() {
    }

    /**
     * get changes on id
     * @param {SimpleChanges} changes
     * @memberof RoleRightsComponent
     */
    async ngOnChanges(changes: SimpleChanges) {
        if (changes.roleID != undefined) {
            if (changes.roleID.currentValue != undefined) {
                let data = await this.roleAPi.get_role_details_profile(this.roleID).toPromise();
                this.profileDetails = data;
                this.initCheckedValue();
            }
        }
        this.changesOnMode(changes);
    }

    /**
     * get changes on mode
     * @param {SimpleChanges} changes
     * @memberof RoleRightsComponent
     */
    changesOnMode(changes: SimpleChanges) {
        if (changes.editMode != undefined) {
            if (changes.editMode.currentValue != undefined) {
                if (changes.editMode.previousValue === 'ON' && changes.editMode.currentValue === 'OFF') {
                    this.patchData();
                }
            }
        }
    }

    /**
     * Initial value for role details 
     * @memberof RoleRightsComponent
     */
    initCheckedValue() {
        this.leaveSetupKey = Object.keys(this.profileDetails.property.allowLeaveSetup).map(key => this.profileDetails.property.allowLeaveSetup[key]);
        this.leaveMngtKey = Object.keys(this.profileDetails.property.allowLeaveManagement).map(value => this.profileDetails.property.allowLeaveManagement[value]);
        this.profileMngtKey = Object.keys(this.profileDetails.property.allowProfileManagement).map(value => this.profileDetails.property.allowProfileManagement[value]);
        this.calendarKey.push(this.profileDetails.property.allowViewCalendar);
        this.reportKey.push(this.profileDetails.property.allowViewReport);
        this.callCheckEvent();
    }

    /**
     * get initial checked value of property 
     * @memberof RoleRightsComponent
     */
    callCheckEvent() {
        this.checkEvent(this.leaveSetupKey, 0);
        this.checkEvent(this.reportKey);
        this.checkEvent(this.leaveMngtKey, 1);
        this.checkEvent(this.calendarKey);
        this.checkEvent(this.profileMngtKey, 2);
    }

    /**
     * Click to select main checkbox, following by child checkbox
     * @param {*} list
     * @param {number} index
     * @memberof RoleRightsComponent
     */
    checkMaster(list, index: number) {
        setTimeout(() => {
            list.forEach(obj => {
                obj.value = this.mainCheckbox[index];
            });
        })
    }

    /**
     * detect checkbox is Indeterminate or not
     * detect main checkbox value
     * @param {*} list
     * @param {number} [masterIndex]
     * @param {number} [index]
     * @memberof RoleRightsComponent
     */
    checkEvent(list: any, masterIndex?: number, index?: number) {
        const totalItems = list.length;
        let checked = 0;
        list.map(obj => {
            if (obj.value) checked++
            if (!obj.value && index > -1) { list[index].level = '' }
        });
        if (checked > 0 && checked < totalItems) {
            this.isIndeterminate[masterIndex] = true;
            this.mainCheckbox[masterIndex] = false;
        } else if (checked == totalItems) {
            this.mainCheckbox[masterIndex] = true;
            this.isIndeterminate[masterIndex] = false;
        } else {
            this.isIndeterminate[masterIndex] = false;
            this.mainCheckbox[masterIndex] = false;
        }
    }

    /**
     * edit role details to send to API
     * @memberof RoleRightsComponent
     */
    async patchData() {
        this.initCheckedValue();
        let details = await this.roleAPi.get_role_details_profile(this.roleID).toPromise();
        this._body["code"] = details.code;
        this._body["description"] = details.description;
        this._body["property"] = this.profileDetails.property;
        const body = {
            "role_guid": this.roleID,
            "data": this._body
        };
        this.roleAPi.patch_role_profile(body).subscribe(response => {
            if (response[0].ROLE_GUID == undefined) {
                this.roleAPi.snackbarMsg(response.status, false);
            }
            this._body = {};
        });
    }

    /**
     * set the value to default (checkbox value to false, level to empty)
     * @memberof RoleRightsComponent
     */
    defaultValue() {
        this.profileDetails.property.allowLeaveSetup.allowLeaveTypeSetup.value = false;
        this.profileDetails.property.allowLeaveSetup.allowLeaveEntitlementSetup.value = false;
        this.profileDetails.property.allowLeaveSetup.allowApprovalGroupSetup.value = false;
        this.profileDetails.property.allowLeaveSetup.allowYearEndClosingSetup.value = false;
        this.profileDetails.property.allowViewReport.value = false;
        this.profileDetails.property.allowViewReport.level = '';
        this.profileDetails.property.allowViewCalendar.value = false;
        this.profileDetails.property.allowViewCalendar.level = '';
        this.profileDetails.property.allowLeaveManagement.allowLeaveAdjustmant.value = false;
        this.profileDetails.property.allowLeaveManagement.allowLeaveAdjustmant.level = '';
        this.profileDetails.property.allowLeaveManagement.allowApplyOnBehalf.value = false;
        this.profileDetails.property.allowLeaveManagement.allowApplyOnBehalf.level = '';
        this.profileDetails.property.allowLeaveManagement.allowApprovalOverride.value = false;
        this.profileDetails.property.allowLeaveManagement.allowApprovalOverride.level = '';
    }

    /**
     * set the value to default (checkbox value to false, level to empty)
     * @memberof RoleRightsComponent
     */
    defaultProfileMngt() {
        this.profileDetails.property.allowProfileManagement.allowViewProfile.value = false;
        this.profileDetails.property.allowProfileManagement.allowViewProfile.level = '';
        this.profileDetails.property.allowProfileManagement.allowEditProfile.value = false;
        this.profileDetails.property.allowProfileManagement.allowEditProfile.level = '';
        this.profileDetails.property.allowProfileManagement.allowChangePassword.value = false;
        this.profileDetails.property.allowProfileManagement.allowChangePassword.level = '';
        this.profileDetails.property.allowProfileManagement.allowProfileAdmin.value = false;
        this.profileDetails.property.allowProfileManagement.allowProfileAdmin.level = '';
    }

}