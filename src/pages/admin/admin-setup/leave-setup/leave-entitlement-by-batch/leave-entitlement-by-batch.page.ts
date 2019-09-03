import { Component, OnInit } from '@angular/core';
import { LeaveEntitlementByBatchAPIService } from './leave-entitlement-by-batch-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaveAPIService } from '../leave-api.service';
import { SnackbarNotificationPage } from '../snackbar-notification/snackbar-notification';
import { MatSnackBar } from '@angular/material';

/**
 * assign leave entitlement according leave type
 * @export
 * @class LeaveEntitlementByBatchPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-entitlement-by-batch',
    templateUrl: './leave-entitlement-by-batch.page.html',
    styleUrls: ['./leave-entitlement-by-batch.page.scss'],
})
export class LeaveEntitlementByBatchPage implements OnInit {

    /**
     * get entitlement list from API
     * @type {*}
     * @memberof LeaveEntitlementByBatchPage
     */
    public entitlementList: any;

    /**
     * form group validation
     * @type {*}
     * @memberof LeaveEntitlementByBatchPage
     */
    public entitlementBatch: any;

    /**
     * get company list from API
     * @type {*}
     * @memberof LeaveEntitlementByBatchPage
     */
    public companyItems: any;

    /**
     * get department list from selected company
     * @type {*}
     * @memberof LeaveEntitlementByBatchPage
     */
    public departmentItems: any;

    /**
     * get all leave type from API
     * @type {*}
     * @memberof LeaveEntitlementByBatchPage
     */
    public leavetypeItems: any;

    /**
     * get user from selected company & department
     * @type {any[]}
     * @memberof LeaveEntitlementByBatchPage
     */
    public filteredUser: any[] = [];

    /**
     * enable/disable the submit button
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public disableSubmit: boolean = true;

    /**
     * checked value of main checkbox
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public checkMain: boolean;

    /**
     * indeterminate value of main checkbox
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public indeterminate: boolean;

    /**
     * show/hide checkbox 
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public hideAvatar: boolean[] = [];

    /**
     * show & hide spinner after clicked submit button
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public showSmallSpinner: boolean = false;

    /**
     * show & hide spinner after selected company & department
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchPage
     */
    public showNoResult: boolean = false;

    /**
     * selected user from filtered user list
     * @private
     * @type {any[]}
     * @memberof LeaveEntitlementByBatchPage
     */
    private _selected_User: any[] = [];

    /**
     * selected company ID from list
     * @private
     * @type {string}
     * @memberof LeaveEntitlementByBatchPage
     */
    private _company_GUID: string;

    /**
     * get user list from API
     * @private
     * @type {*}
     * @memberof LeaveEntitlementByBatchPage
     */
    private _user_Items: any;

    /**
     *Creates an instance of LeaveEntitlementByBatchPage.
     * @param {LeaveEntitlementByBatchAPIService} leaveEntitlementAPI
     * @param {LeaveAPIService} leaveAPI
     * @param {MatSnackBar} snackBar
     * @memberof LeaveEntitlementByBatchPage
     */
    constructor(private leaveEntitlementAPI: LeaveEntitlementByBatchAPIService, private leaveAPI: LeaveAPIService) {
        this.entitlementBatch = new FormGroup({
            tenant: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            leavetype: new FormControl('', Validators.required),
            entitlement_code: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(list => this.companyItems = list);
        this.leaveAPI.get_admin_leavetype().subscribe(list => this.leavetypeItems = list);
        this.leaveEntitlementAPI.get_leavetype_entitlement().subscribe(list => this.entitlementList = list)
    }

    /**
     * select company & pass company guid to get department list
     * @param {*} company_guid
     * @memberof LeaveEntitlementByBatchPage
     */
    companyClicked(company_guid: string) {
        this.showSpinner = true;
        this._company_GUID = company_guid;
        this.leaveAPI.get_company_details(company_guid).subscribe(item => {
            this.departmentItems = item.departmentList;
            this.showSpinner = false;
        })
    }

    /**
     * get user list from API
     * @param {*} name
     * @memberof LeaveEntitlementByBatchPage
     */
    departmentClicked(name: string) {
        this.filteredUser = [];
        this.showSpinner = true;
        this.leaveEntitlementAPI.get_user_list().subscribe(list => {
            this._user_Items = list;
            this.showSpinner = false;
            this.filterUser(this._user_Items, name);
        })
    }

    /**
     * get user list to filter from selected compant & department
     * @param {*} list
     * @param {string} name
     * @memberof LeaveEntitlementByBatchPage
     */
    filterUser(list: any, name: string) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].department === name && list[i].companyId === this._company_GUID) {
                this.filteredUser.push(list[i]);
                this.hideAvatar.push(false);
                this.filteredUser[this.filteredUser.length - 1].isChecked = false;
            }
        }
        if (this.filteredUser.length == 0) {
            this.showNoResult = true;
        } else { this.showNoResult = false; }
    }

    /**
     * checking to enable/disable submit button
     * @memberof LeaveEntitlementByBatchPage
     */
    checkEnableDisableButton() {
        if (this.entitlementBatch.valid && (this.checkMain || this.indeterminate)) {
            this.disableSubmit = false;
        } else {
            this.disableSubmit = true;
        }
    }

    /**
     * mouse hover to show/hide checkbox
     * @param {number} index
     * @param {boolean} mouseOver
     * @param {boolean} checked
     * @memberof LeaveEntitlementByBatchPage
     */
    mouseInOutEvent(index: number, mouseOver: boolean, checked: boolean) {
        if (checked && (this.checkMain || this.indeterminate)) {
            this.hideAvatar.splice(0, this.hideAvatar.length);
            this.filteredUser.map(item => { this.hideAvatar.push(true); });
        } else if (!checked && (this.checkMain || this.indeterminate)) {
            this.hideAvatar.splice(0, this.hideAvatar.length);
            this.filteredUser.map(item => { this.hideAvatar.push(true); });
        } else if (mouseOver && !checked && !this.indeterminate && !this.checkMain) {
            this.hideAvatar.splice(index, 1, true);
        } else {
            this.hideAvatar.splice(0, this.hideAvatar.length);
            this.filteredUser.map(item => { this.hideAvatar.push(false); });
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof LeaveEntitlementByBatchPage
     */
    checkEvent() {
        setTimeout(() => {
            this.hideAvatar.splice(0, this.hideAvatar.length);
            this.filteredUser.forEach(userList => {
                userList.isChecked = this.checkMain;
                if (userList.isChecked) {
                    this.hideAvatar.push(true);
                } else {
                    this.hideAvatar.push(false);
                }
                this.checkEnableDisableButton();
            });
        })
    }

    /**
     * check sub checkbox to make changing in main checkbox (interminate/checkMain)
     * @memberof LeaveEntitlementByBatchPage
     */
    subEvent() {
        const length = this.filteredUser.length;
        let checked = 0;
        this.filteredUser.map(item => {
            if (item.isChecked) {
                checked++;
                this.hideAvatar.push(true);
            }
        });
        if (checked > 0 && checked < length) {
            this.indeterminate = true;
            this.checkMain = false;
        } else if (checked == length) {
            this.checkMain = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = false;
            this.checkMain = false;
        }
        this.checkEnableDisableButton();
    }

    /**
     * get selected user from list
     * @memberof LeaveEntitlementByBatchPage
     */
    checkedUserList() {
        this.filteredUser.forEach((element, i) => {
            if (element.isChecked) {
                this._selected_User.push(this.filteredUser[i].userId);
            }
        });
    }


    /**
     * post leave entitlement by batch
     * @memberof LeaveEntitlementByBatchPage
     */
    postLeaveEntitlement() {
        this.checkedUserList();
        this.showSmallSpinner = true;
        const body = {
            "userId": this._selected_User,
            "leaveTypeId": this.entitlementBatch.controls.leavetype.value,
            "leaveEntitlementId": this.entitlementBatch.controls.entitlement_code.value
        };
        this.leaveEntitlementAPI.post_leave_entitlement(body).subscribe(response => {
            this.openMsg('submitted successfully ');
            this.showSmallSpinner = false;
            this.filteredUser = [];
            this._selected_User = [];
            this.filteredUser.forEach(element => {
                element.isChecked = false;
            });
        });
    }

    /**
     * show pop up snackbar
     * @param {string} popUpText
     * @memberof LeaveAdjustmentPage
     */
    openMsg(popUpText: string) {
        this.leaveAPI.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 5000,
            data: popUpText
        });
    }

}