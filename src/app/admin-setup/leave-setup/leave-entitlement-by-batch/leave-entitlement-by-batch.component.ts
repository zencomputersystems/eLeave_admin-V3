import { Component, OnInit } from '@angular/core';
import { LeaveEntitlementByBatchApiService } from './leave-entitlement-by-batch-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaveApiService } from '../leave-api.service';

/**
 * assign leave entitlement according leave type
 * @export
 * @class LeaveEntitlementByBatchComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-entitlement-by-batch',
    templateUrl: './leave-entitlement-by-batch.component.html',
    styleUrls: ['./leave-entitlement-by-batch.component.scss'],
})
export class LeaveEntitlementByBatchComponent implements OnInit {

    /**
     * get entitlement list from API
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public entitlementList: any;

    /**
     * form group validation
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public entitlementBatch: any;

    /**
     * get company list from API
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public companyItems: any;

    /**
     * get department list from selected company
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public departmentItems: any;

    /**
     * get all leave type from API
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public leavetypeItems: any;

    /**
     * get user from selected company & department
     * @type {any[]}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public filteredUser: any[] = [];

    /**
     * enable/disable the submit button
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public disableSubmit: boolean = true;

    /**
     * checked value of main checkbox
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public checkMain: boolean;

    /**
     * indeterminate value of main checkbox
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public indeterminate: boolean;

    /**
     * show/hide checkbox 
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public hideAvatar: boolean[] = [];

    /**
     * show & hide spinner after clicked submit button
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * show & hide spinner after selected company & department
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public showNoResult: boolean = false;

    /**
     * show select to view paragraph
     * @type {boolean}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public showSelectToView: boolean = true;

    /**
     * filtered entitlement by leave type guid
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    public filteredEntitlement: any;

    /**
     * selected user from filtered user list
     * @private
     * @type {any[]}
     * @memberof LeaveEntitlementByBatchComponent
     */
    private _selected_User: any[] = [];

    /**
     * selected company ID from list
     * @private
     * @type {string}
     * @memberof LeaveEntitlementByBatchComponent
     */
    private _company_GUID: string;

    /**
     * get user list from API
     * @private
     * @type {*}
     * @memberof LeaveEntitlementByBatchComponent
     */
    private _user_Items: any;

    /**
     *Creates an instance of LeaveEntitlementByBatchComponent.
     * @param {LeaveEntitlementByBatchApiService} leaveEntitlementAPI
     * @param {LeaveApiService} leaveAPI
     * @memberof LeaveEntitlementByBatchComponent
     */
    constructor(private leaveEntitlementAPI: LeaveEntitlementByBatchApiService, private leaveAPI: LeaveApiService) {
        this.entitlementBatch = new FormGroup({
            tenant: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            leavetype: new FormControl('', Validators.required),
            entitlement_code: new FormControl('', Validators.required)
        })
    }

    /**
     * get initial method list from endpoint
     * @memberof LeaveEntitlementByBatchComponent
     */
    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(list => this.companyItems = list);
        this.leaveAPI.get_admin_leavetype().subscribe(list => this.leavetypeItems = list);
        this.leaveEntitlementAPI.get_leavetype_entitlement().subscribe(list => this.entitlementList = list)
    }

    /**
     * select company & pass company guid to get department list
     * @param {*} company_guid
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
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
     * @memberof LeaveEntitlementByBatchComponent
     */
    checkedUserList() {
        this.filteredUser.forEach((element, i) => {
            if (element.isChecked) {
                this._selected_User.push(this.filteredUser[i].userId);
            }
        });
    }

    /**
     * get leavetype entitlement by leavetype guid
     * @param {string} leaveTypeGuid
     * @memberof LeaveEntitlementByBatchComponent
     */
    getLeaveType(leaveTypeGuid: string) {
        this.filteredEntitlement = [];
        for (let i = 0; i < this.entitlementList.length; i++) {
            if (this.entitlementList[i].leaveTypeId === leaveTypeGuid) {
                this.filteredEntitlement.push(this.entitlementList[i]);
            }
        }

    }


    /**
     * post leave entitlement by batch
     * @memberof LeaveEntitlementByBatchComponent
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
            this.leaveAPI.openSnackBar('You have submitted successfully', true);
            this.showSmallSpinner = false;
            this.filteredUser = [];
            this._selected_User = [];
            this.filteredEntitlement = [];
            this.filteredUser.forEach(element => {
                element.isChecked = false;
            });
            this.checkEnableDisableButton();
        });
    }

}