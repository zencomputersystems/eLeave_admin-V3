import { Component, OnInit } from '@angular/core';
import { RoleApiService } from '../role-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { roleDetails, options } from '../role-details-data';

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
     * Role details from each roleID 
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public profileDetails: any;

    /**
     * SHow/hide Loading spinner 
     * @type {boolean}
     * @memberof RoleRightsComponent
     */
    public showSpinner: boolean = true;

    /**
     * Show/hide small Spinner when await for requested list from API
     * @type {boolean}
     * @memberof RoleRightsComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * Show clear & submit button in create-new-role path only
     * @type {boolean}
     * @memberof RoleRightsComponent
     */
    public showButtons: boolean = false;

    /**
     * Show content after the details loaded from API
     * @type {boolean}
     * @memberof RoleRightsComponent
     */
    public showContent: boolean = false;

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
     * form group of input rolename & description
     * @type {*}
     * @memberof RoleRightsComponent
     */
    public inputFormControl: any;

    /**
     * roleId value get from url 
     * used for request role profile details
     * @private
     * @type {string}
     * @memberof RoleRightsComponent
     */
    private _roleId: string;

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
     * @param {ActivatedRoute} route
     * @param {Router} router
     * @memberof RoleRightsComponent
     */
    constructor(private roleAPi: RoleApiService, private route: ActivatedRoute, private router: Router) {
        route.params.subscribe(params => { this._roleId = params.id; });
        this.inputFormControl = new FormGroup({
            rolename: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
        })
        this.viewReportList = options;
    }


    ngOnInit() {
        if (this.route.routeConfig.path.includes('create-new-role')) {
            this.showButtons = true;
            this.profileDetails = roleDetails;
            this.initCheckedValue();
        } else {
            this.roleAPi.get_role_details_profile(this._roleId).subscribe(data => {
                this.profileDetails = data;
                this.inputFormControl.patchValue({
                    rolename: this.profileDetails.code,
                    description: this.profileDetails.description
                });
                this.showSmallSpinner = false;
                this.initCheckedValue();
            }, error => {
                window.location.href = '/login';
            });
        }
    }

    /**
     * Initial value for role details 
     * @memberof RoleRightsComponent
     */
    initCheckedValue() {
        this.showSpinner = false;
        this.showContent = true;
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
    patchData() {
        const body = {
            "role_guid": this._roleId,
            "data": this._body
        };
        this.roleAPi.patch_role_profile(body).subscribe(response => {
            this.showSmallSpinner = false;
            this.roleAPi.snackbarMsg('saved successfully');
        }, error => {
            this.roleAPi.snackbarMsg('saved unsuccessfully');
            window.location.href = '/login';
        });
    }

    /**
     * Submit/save value to send to API
     * POST/PATCH
     * @memberof RoleRightsComponent
     */
    save() {
        this._body["code"] = this.inputFormControl.value.rolename;
        this._body["description"] = this.inputFormControl.value.description;
        this._body["property"] = this.profileDetails.property;
        if (this.showButtons === true) {
            this.roleAPi.post_role_profile(this._body).subscribe(response => {
                this.showSmallSpinner = false;
                this.defaultValue();
                this.defaultProfileMngt();
                this.roleAPi.snackbarMsg('saved successfully');
                setTimeout(() => {
                    this.router.navigate(['/main/role-management']);
                }, 2000);
            }, error => {
                this.roleAPi.snackbarMsg('saved unsuccessfully');
            });
        } else {
            this.patchData();
        }
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