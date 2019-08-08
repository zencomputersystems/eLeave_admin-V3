import { Component, OnInit } from '@angular/core';
import { LeaveAPIService } from '../leave-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from 'src/services/shared-service/api.service';
import { SnackbarNotificationPage } from '../snackbar-notification/snackbar-notification';
import { MatSnackBar } from '@angular/material';

/**
 * override approval for pending leave applciation 
 * @export
 * @class ApprovalOverridePage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-approval-override',
    templateUrl: './approval-override.page.html',
    styleUrls: ['./approval-override.page.scss'],
})
export class ApprovalOverridePage implements OnInit {

    /**
     * company list from API
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    public companyList: any;

    /**
     * department list from API
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    public departmentList: any;

    /**
     * validation for form field
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    public approvalForm: any;

    /**
     * list of pending approval application, filtered from selected company & department
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    public filteredPendingList: any = [];

    /**
     * main checkbox value
     * @type {boolean}
     * @memberof ApprovalOverridePage
     */
    public mainCheckbox: boolean;

    /**
     * indetermine value of checkbox
     * @type {boolean}
     * @memberof ApprovalOverridePage
     */
    public indeterminate: boolean;

    /**
     * show /hide checkbox & vice versa for avatar
     * @type {boolean}
     * @memberof ApprovalOverridePage
     */
    public displayCheckbox: boolean = false;

    /**
     * selected pending application's leaveTransactionGUID to patch to API 
     * @type {string[]}
     * @memberof ApprovalOverridePage
     */
    public leaveTransactionGUID: string[] = [];

    /**
     * enable/disable submit button
     * @type {boolean}
     * @memberof ApprovalOverridePage
     */
    public disableButton: boolean = true;

    /**
     * show small spinner when loading
     * @type {boolean}
     * @memberof ApprovalOverridePage
     */
    public showSmallSpinner: boolean = false;

    /**
     * users list from API
     * @private
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    private _userList: any;

    /**
     * pending approval application list
     * @private
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    private _pendingList: any;

    /**
     * companyId from selected company list 
     * to get department list from this id
     * @private
     * @type {string}
     * @memberof ApprovalOverridePage
     */
    private _companyId: string;

    /**
     * user list from selected department
     * @private
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    private _filteredUserList: any = [];

    /**
     * leave type list from API
     * @private
     * @type {*}
     * @memberof ApprovalOverridePage
     */
    private _leaveTypeList: any;

    /**
     *Creates an instance of ApprovalOverridePage.
     * @param {LeaveAPIService} leaveAPI
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof ApprovalOverridePage
     */
    constructor(private leaveAPI: LeaveAPIService, private apiService: APIService, private snackBar: MatSnackBar) {
        this.approvalForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            remark: new FormControl('', Validators.required),
            radio: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(list => this.companyList = list)
        this.leaveAPI.get_approval_override_list().subscribe(list => this._pendingList = list)
    }

    /**
     * filter user from approval override list according filteredPendingList
     * @param {*} list
     * @param {*} obj
     * @param {number} index
     * @memberof ApprovalOverridePage
     */
    filterUserGUID(list: any, obj: any, index: number) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].USER_GUID === obj) {
                this.filteredPendingList.push(this._pendingList[i]);
                this.filteredPendingList[this.filteredPendingList.length - 1].employeeName = this._filteredUserList[index].employeeName;
                this.filteredPendingList[this.filteredPendingList.length - 1].isChecked = false;
                this.getLeaveType(this.filteredPendingList.length - 1, this._pendingList[i].LEAVE_TYPE_GUID);
            }
        }
    }

    /**
     * selected company id to get department list
     * @param {*} company_guid
     * @memberof ApprovalOverridePage
     */
    selectedCompany(company_guid) {
        this._companyId = company_guid;
        this.leaveAPI.get_company_details(company_guid).subscribe(list => {
            this.departmentList = list.departmentList;
        })
    }

    /**
     * selected department name to get user list
     * @param {*} departmentName
     * @memberof ApprovalOverridePage
     */
    selectedDepartment(departmentName) {
        this.filteredPendingList = [];
        this._filteredUserList = [];
        this.apiService.get_user_profile_list().subscribe(list => {
            this._userList = list;
            for (let i = 0; i < this._userList.length; i++) {
                if (this._userList[i].department === departmentName && this._userList[i].companyId === this._companyId) {
                    this._filteredUserList.push(this._userList[i]);
                }
            }
            this.checkPendingUserList();
        })
    }

    /**
     * compare approval override list with user list of selected department
     * @memberof ApprovalOverridePage
     */
    checkPendingUserList() {
        for (let j = 0; j < this._filteredUserList.length; j++) {
            this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId, j);
        }
    }

    /**
     * get leave type name from id
     * @param {number} index
     * @param {string} leaveTypeGuid
     * @memberof ApprovalOverridePage
     */
    getLeaveType(index: number, leaveTypeGuid: string) {
        this.leaveAPI.get_admin_leavetype().subscribe(type => {
            this._leaveTypeList = type;
            for (let i = 0; i < this._leaveTypeList.length; i++) {
                if (leaveTypeGuid === this._leaveTypeList[i].LEAVE_TYPE_GUID) {
                    this.filteredPendingList[index].leveTypeName = this._leaveTypeList[i].CODE;
                }
            }
        })
    }

    /**
     * value of main checkbox & indetermine
     * @memberof ApprovalOverridePage
     */
    mainEvent() {
        setTimeout(() => {
            this.filteredPendingList.forEach(item => {
                item.isChecked = this.mainCheckbox;
                if (item.isChecked) {
                    this.displayCheckbox = true;
                } else {
                    this.displayCheckbox = false;
                }
                this.enableDisableButton();
            });
        })
    }

    /**
     * value of clicked sub checkbox
     * @memberof ApprovalOverridePage
     */
    subEvent() {
        const total = this.filteredPendingList.length;
        let checkedItem = 0;
        this.filteredPendingList.map(item => {
            if (item.isChecked) {
                checkedItem++;
            }
        });
        if (checkedItem > 0 && checkedItem < total) {
            this.indeterminate = true;
            this.mainCheckbox = false;
        } else if (checkedItem == total) {
            this.mainCheckbox = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = false;
            this.mainCheckbox = false;
        }
        this.enableDisableButton();
    }

    /**
     * hover event for checkbox & avatar
     * @param {*} value
     * @param {*} isChecked
     * @memberof ApprovalOverridePage
     */
    mouseEvent(value, isChecked) {
        if (isChecked && (this.mainCheckbox || this.indeterminate)) {
            this.displayCheckbox = true;
        } else if (!isChecked && (this.mainCheckbox || this.indeterminate)) {
            this.displayCheckbox = true;
        } else if (value && !isChecked && !this.indeterminate && !this.mainCheckbox) {
            this.displayCheckbox = true;
        } else {
            this.displayCheckbox = false;
        }
    }

    /**
     * enable/disable submit button
     * @memberof ApprovalOverridePage
     */
    enableDisableButton() {
        if (this.approvalForm.valid && (this.mainCheckbox || this.indeterminate)) {
            this.disableButton = false;
        } else {
            this.disableButton = true;
        }
    }

    /**
     * snackbar message after submit approval
     * @param {string} text
     * @memberof ApprovalOverridePage
     */
    notification(text: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 5000,
            data: text
        });
    }

    /**
     * patch selected user pending approval application 
     * @memberof ApprovalOverridePage
     */
    patchStatus() {
        this.showSmallSpinner = true;
        this.filteredPendingList.forEach((element, i) => {
            if (element.isChecked) {
                this.leaveTransactionGUID.push(this.filteredPendingList[i].LEAVE_TRANSACTION_GUID);
            }
        });
        const body = {
            "leaveTransactionId": this.leaveTransactionGUID,
            "status": this.approvalForm.controls.radio.value,
            "remark": this.approvalForm.controls.remark.value
        }
        this.leaveAPI.patch_approval_override(body).subscribe(response => {
            this.notification('submitted successfully. ');
            this.filteredPendingList = [];
            this.showSmallSpinner = false;
            this.filteredPendingList.forEach(element => {
                element.isChecked = false;
            });
        });
    }



}