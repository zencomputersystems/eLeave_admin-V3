import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { LeaveApiService } from '../leave-api.service';
import { LeaveEntitlementByBatchApiService } from '../leave-entitlement-by-batch/leave-entitlement-by-batch-api.service';

/**
 * setup of email notification rule
 * @export
 * @class NotificationRuleComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-notification-rule',
    templateUrl: './notification-rule.component.html',
    styleUrls: ['./notification-rule.component.scss'],
})
export class NotificationRuleComponent implements OnInit {

    /**
     * form group validation
     * @type {*}
     * @memberof NotificationRuleComponent
     */
    public entitlementBatch: any;

    /**
     * get company list from API
     * @type {*}
     * @memberof NotificationRuleComponent
     */
    public companyItems: any;

    /**
     * get department list from selected company
     * @type {*}
     * @memberof NotificationRuleComponent
     */
    public departmentItems: any;

    /**
     * get user from selected company & department
     * @type {any[]}
     * @memberof NotificationRuleComponent
     */
    public filteredUser: any[] = [];

    /**
     * enable/disable the submit button
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public disableSubmit: boolean = true;

    /**
     * checked value of main checkbox
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public checkMain: boolean;

    /**
     * indeterminate value of main checkbox
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public indeterminate: boolean;

    /**
     * show/hide checkbox 
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public hideAvatar: boolean[] = [];

    /**
     * show & hide spinner after clicked submit button
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * show & hide spinner after selected company & department
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public showNoResult: boolean = false;

    /**
     * show select to view paragraph
     * @type {boolean}
     * @memberof NotificationRuleComponent
     */
    public showSelectToView: boolean = true;

    /**
     * url of profile picture
     * @type {*}
     * @memberof NotificationRuleComponent
     */
    public url: any;

    public employeeList: any;

    /**
     * selected user from filtered user list
     * @private
     * @type {any[]}
     * @memberof NotificationRuleComponent
     */
    private _selected_User: any[] = [];

    /**
     * selected company ID from list
     * @private
     * @type {string}
     * @memberof NotificationRuleComponent
     */
    private _company_GUID: string;

    /**
     * get user list from API
     * @private
     * @type {*}
     * @memberof NotificationRuleComponent
     */
    private _user_Items: any;

    /**
     *Creates an instance of NotificationRuleComponent.
     * @param {LeaveEntitlementByBatchApiService} leaveEntitlementAPI
     * @param {LeaveApiService} leaveAPI
     * @param {Platform} applyonbehalfPlatformApi
     * @memberof NotificationRuleComponent
     */
    constructor(private leaveEntitlementAPI: LeaveEntitlementByBatchApiService, private leaveAPI: LeaveApiService, public applyonbehalfPlatformApi: Platform) {
        this.entitlementBatch = new FormGroup({
            tenant: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            leavetype: new FormControl('', Validators.required),
            entitlement_code: new FormControl('', Validators.required)
        })

        this.leaveEntitlementAPI.apiService.get_profile_pic('all').subscribe(data => {
            this.url = data;
        })
    }

    /**
     * get initial method list from endpoint
     * @memberof NotificationRuleComponent
     */
    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(list => this.companyItems = list);
        this.leaveEntitlementAPI.get_user_list().subscribe(list => {
            this.employeeList = list;
            console.log(this.employeeList)
            // this.showSpinner = false;
            // this.filterUser(this._user_Items, name);
        })
    }

    /**
     * select company & pass company guid to get department list
     * @param {*} company_guid
     * @memberof NotificationRuleComponent
     */
    companyClicked(company_guid: string) {
        // this.showSpinner = true;
        this._company_GUID = company_guid;
        this.leaveAPI.get_company_details(company_guid).subscribe(item => {
            this.departmentItems = item.departmentList;
            // this.showSpinner = false;
        })
    }

    /**
     * get user list from API
     * @param {*} name
     * @memberof NotificationRuleComponent
     */
    departmentClicked(name: string) {
        this.filteredUser = [];
        this.showSpinner = true;
        this.showSelectToView = false;
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
     * @memberof NotificationRuleComponent
     */
    filterUser(list: any, name: string) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].department === name && list[i].companyId === this._company_GUID && name !== 'All' || name === 'All') {
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
     * @memberof NotificationRuleComponent
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
     * @memberof NotificationRuleComponent
     */
    mouseInOutEvent(index: number, mouseOver: boolean, checked: boolean) {
        if (this.checkMain || this.indeterminate) {
            this.hideAvatar.splice(0, this.hideAvatar.length);
            this.hideAvatar.push(...Array(this.filteredUser.length).fill(true));
        } else if (mouseOver && !checked && !this.indeterminate && !this.checkMain) {
            this.hideAvatar.splice(index, 1, true);
        } else {
            this.hideAvatar.splice(0, this.hideAvatar.length);
            this.hideAvatar.push(...Array(this.filteredUser.length).fill(false));
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof NotificationRuleComponent
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
     * @memberof NotificationRuleComponent
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
     * @memberof NotificationRuleComponent
     */
    checkedUserList() {
        this.filteredUser.forEach((element, i) => {
            if (element.isChecked) {
                this._selected_User.push(this.filteredUser[i].userId);
            }
        });
    }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof NotificationRuleComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let name = this.employeeList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let id = this.employeeList.filter((list: any) => {
                if (list.staffNumber != undefined) {
                    return (list.staffNumber.indexOf(text) > -1)
                }
            })
            this.employeeList = require('lodash').uniqBy(name.concat(id), 'id');
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof NotificationRuleComponent
     */
    changeDetails(text: any) {
        if (text === '') {
            this.ngOnInit();
        } else {
            this.filter(text);
        }
    }


    /**
     * post leave entitlement by batch
     * @memberof NotificationRuleComponent
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
            if (response.failedList.length != 0) {
                this.leaveAPI.openSnackBar(response.failedList[0].status, false);
            } else {
                this.leaveAPI.openSnackBar('You have submitted successfully', true);
                this.entitlementBatch.reset();
                this.filteredUser = [];
            }
            this.showSmallSpinner = false;
            this.checkMain = false;
            this.indeterminate = false;
            this._selected_User = [];
            this.filteredUser.forEach(element => {
                element.isChecked = false;
            });
            this.checkEnableDisableButton();
        }, err => {
            this.leaveAPI.openSnackBar('Failed to submit request', false);
            this.showSmallSpinner = false;
            this.checkMain = false;
            this.indeterminate = false;
            this._selected_User = [];
            this.filteredUser.forEach(element => {
                element.isChecked = false;
            });
            this.checkEnableDisableButton();
        });
    }
}