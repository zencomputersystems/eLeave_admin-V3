import { Component, OnInit } from '@angular/core';
import { RolesAPIService } from '../role-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarNotificationPage } from '../../leave-setup/snackbar-notification/snackbar-notification';
import { MatSnackBar } from '@angular/material';
import { roleDetails, options } from '../role-details-data';

/**
 * Manage rights/permission for each role
 * @export
 * @class RoleRightsPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-rights',
    templateUrl: './role-rights.page.html',
    styleUrls: ['./role-rights.page.scss'],
})
export class RoleRightsPage implements OnInit {

    /**
     * Role details from each roleID 
     * @type {*}
     * @memberof RoleRightsPage
     */
    public profileDetails: any;

    /**
     * SHow/hide Loading spinner 
     * @type {boolean}
     * @memberof RoleRightsPage
     */
    public showSpinner: boolean = true;

    /**
     * Show/hide small Spinner when await for requested list from API
     * @type {boolean}
     * @memberof RoleRightsPage
     */
    public showSmallSpinner: boolean = false;

    /**
     * Show clear & submit button in create-new-role path only
     * @type {boolean}
     * @memberof RoleRightsPage
     */
    public showButtons: boolean = false;

    /**
     * Show content after the details loaded from API
     * @type {boolean}
     * @memberof RoleRightsPage
     */
    public showContent: boolean = false;

    /**
     * Value of checkbox (either indeterminate or vice versa)
     * @type {boolean[]}
     * @memberof RoleRightsPage
     */
    public isIndeterminate: boolean[] = [false, false, false];

    /**
     * Value of main checkbox (either true or vice versa)
     * @type {boolean[]}
     * @memberof RoleRightsPage
     */
    public mainCheckbox: boolean[] = [false, false, false];

    /**
     * Options in select input
     * @type {*}
     * @memberof RoleRightsPage
     */
    public viewReportList: any;

    /**
     * checked value for all leave setup child in array
     * @type {*}
     * @memberof RoleRightsPage
     */
    public leaveSetupKey: any;

    /**
     * checked value for all leave management child in array
     * @type {*}
     * @memberof RoleRightsPage
     */
    public leaveMngtKey: any;

    /**
     * checked value for all profile management child in array
     * @type {*}
     * @memberof RoleRightsPage
     */
    public profileMngtKey: any;

    /**
     * checked value of view calendar
     * @memberof RoleRightsPage
     */
    public calendarKey = [];

    /**
     * checked value of view report
     * @memberof RoleRightsPage
     */
    public reportKey = [];

    /**
     * form group of input rolename & description
     * @type {*}
     * @memberof RoleRightsPage
     */
    public inputFormControl: any;

    /**
     * roleId value get from url 
     * used for request role profile details
     * @private
     * @type {string}
     * @memberof RoleRightsPage
     */
    private _roleId: string;

    /**
     * code, description, property to send to API
     * @private
     * @type {*}
     * @memberof RoleRightsPage
     */
    private _body: any = {};

    /**
     *Creates an instance of RoleRightsPage.
     * @param {RolesAPIService} roleAPi
     * @param {ActivatedRoute} route
     * @param {MatSnackBar} snackBar
     * @memberof RoleRightsPage
     */
    constructor(private roleAPi: RolesAPIService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
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
     * @memberof RoleRightsPage
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
     * @memberof RoleRightsPage
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
     * @memberof RoleRightsPage
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
     * @memberof RoleRightsPage
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
     * @memberof RoleRightsPage
     */
    patchData() {
        const body = {
            "role_guid": this._roleId,
            "data": this._body
        };
        this.roleAPi.patch_role_profile(body).subscribe(response => {
            this.showSmallSpinner = false;
            this.openSnackBar('saved successfully');
        }, error => {
            this.openSnackBar('saved unsuccessfully');
            window.location.href = '/login';
        });
    }

    /**
     * Submit/save value to send to API
     * POST/PATCH
     * @memberof RoleRightsPage
     */
    save() {
        this._body["code"] = this.inputFormControl.value.rolename;
        this._body["description"] = this.inputFormControl.value.description;
        this._body["property"] = this.profileDetails.property;
        if (this.showButtons === true) {
            this.roleAPi.post_role_profile(this._body).subscribe(response => {
                this.showSmallSpinner = false;
                this.openSnackBar('saved successfully');
            }, error => {
                this.openSnackBar('saved unsuccessfully');
                window.location.href = '/login';
            });
        } else {
            this.patchData();
        }
    }

    /**
     * Show alert message after submit role details to API
     * @param {string} message
     * @memberof RoleRightsPage
     */
    openSnackBar(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }

}