import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApprovalOverrideApiService } from './approval-override-api.service';

/**
 * override approval for pending leave applciation 
 * @export
 * @class ApprovalOverrideComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-approval-override',
    templateUrl: './approval-override.component.html',
    styleUrls: ['./approval-override.component.scss'],
})
export class ApprovalOverrideComponent implements OnInit {

    /**
     * company list from API
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public companyList: any;

    /**
     * department list from API
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public departmentList: any;

    /**
     * validation for form field
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public approvalForm: any;

    /**
     * list of pending approval application, filtered from selected company & department
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public filteredPendingList: any = [];

    /**
     * main checkbox value
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public mainCheckbox: boolean;

    /**
     * indetermine value of checkbox
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public indeterminate: boolean;

    /**
     * show /hide checkbox & vice versa for avatar
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public displayCheckbox: boolean[] = [];

    /**
     * selected pending application's leaveTransactionGUID to patch to API 
     * @type {string[]}
     * @memberof ApprovalOverrideComponent
     */
    public leaveTransactionGUID: string[] = [];

    /**
     * enable/disable submit button
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public disableButton: boolean = true;

    /**
     * show small spinner when loading after clicked submit button
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * show spinner after click selection of company & department
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public showNoResult: boolean = false;

    /**
     * users list from API
     * @private
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    private _userList: any;

    /**
     * pending approval application list
     * @private
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    private _pendingList: any;

    /**
     * companyId from selected company list 
     * to get department list from this id
     * @private
     * @type {string}
     * @memberof ApprovalOverrideComponent
     */
    private _companyId: string;

    /**
     * user list from selected department
     * @private
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    private _filteredUserList: any = [];

    /**
     * leave type list from API
     * @private
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    private _leaveTypeList: any;

    /**
     *Creates an instance of ApprovalOverrideComponent.
     * @param {ApprovalOverrideApiService} approvalOverrideAPI
     * @param {MatSnackBar} snackBar
     * @memberof ApprovalOverrideComponent
     */
    constructor(private approvalOverrideAPI: ApprovalOverrideApiService) {
        this.approvalForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            remark: new FormControl('', Validators.required),
            radio: new FormControl('', Validators.required)
        })
    }

    /**
     * initial method to get list from endpoint
     * @memberof ApprovalOverrideComponent
     */
    ngOnInit() {
        this.approvalOverrideAPI.get_company_list().subscribe(list => this.companyList = list)
    }

    /**
     * filter user from approval override list according filteredPendingList
     * @param {*} list
     * @param {*} obj
     * @param {number} index
     * @memberof ApprovalOverrideComponent
     */
    filterUserGUID(list: any, obj: any, index: number) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].USER_GUID === obj) {
                this.filteredPendingList.push(this._pendingList[i]);
                this.displayCheckbox.push(false);
                this.filteredPendingList[this.filteredPendingList.length - 1].employeeName = this._filteredUserList[index].employeeName;
                this.filteredPendingList[this.filteredPendingList.length - 1].isChecked = false;
                this.getLeaveType(this.filteredPendingList.length - 1, this._pendingList[i].LEAVE_TYPE_GUID);
            } else { this.showNoResult = true; }
        }
    }

    /**
     * selected company id to get department list
     * @param {*} company_guid
     * @memberof ApprovalOverrideComponent
     */
    selectedCompany(company_guid: string) {
        this.showSpinner = true;
        this._companyId = company_guid;
        this.approvalOverrideAPI.get_company_detail(company_guid).subscribe(list => {
            this.departmentList = list.departmentList;
            this.showSpinner = false;
        })
        this.approvalOverrideAPI.get_approval_override_list().subscribe(list => this._pendingList = list)
    }

    /**
     * selected department name to get user list
     * @param {*} departmentName
     * @memberof ApprovalOverrideComponent
     */
    selectedDepartment(departmentName: string) {
        this.filteredPendingList = [];
        this._filteredUserList = [];
        this.leaveTransactionGUID = [];
        this.showSpinner = true;
        this.approvalOverrideAPI.get_user_profile_list().subscribe(list => {
            this._userList = list;
            this.showSpinner = false;
            this.checkPendingUserList(departmentName);
        })
    }

    /**
     * compare approval override list with user list of selected department
     * @memberof ApprovalOverrideComponent
     */
    checkPendingUserList(departmentName: string) {
        for (let i = 0; i < this._userList.length; i++) {
            if (this._userList[i].department === departmentName && this._userList[i].companyId === this._companyId) {
                this._filteredUserList.push(this._userList[i]);
            } else {
                this.showNoResult = true;
            }
        }
        for (let j = 0; j < this._filteredUserList.length; j++) {
            this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId, j);
        }
    }

    /**
     * get leave type name from id
     * @param {number} index
     * @param {string} leaveTypeGuid
     * @memberof ApprovalOverrideComponent
     */
    getLeaveType(index: number, leaveTypeGuid: string) {
        this.approvalOverrideAPI.get_admin_leavetype().subscribe(type => {
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
     * @memberof ApprovalOverrideComponent
     */
    mainEvent() {
        this.displayCheckbox.splice(0, this.displayCheckbox.length);
        setTimeout(() => {
            this.filteredPendingList.forEach(item => {
                item.isChecked = this.mainCheckbox;
                if (item.isChecked) {
                    this.displayCheckbox.push(true);
                } else {
                    this.displayCheckbox.push(false);
                }
                this.enableDisableButton();
            });
        })
    }

    /**
     * value of clicked sub checkbox
     * @memberof ApprovalOverrideComponent
     */
    subEvent() {
        const total = this.filteredPendingList.length;
        let checkedItem = 0;
        this.filteredPendingList.map(item => {
            if (item.isChecked) {
                checkedItem++;
                this.displayCheckbox.push(true);
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
     * @memberof ApprovalOverrideComponent
     */
    mouseEvent(value: boolean, index: number, isChecked: boolean) {
        if (isChecked && (this.mainCheckbox || this.indeterminate)) {
            this.displayCheckbox.splice(0, this.displayCheckbox.length);
            this.filteredPendingList.map(value => { this.displayCheckbox.push(true); });
        } else if (!isChecked && (this.mainCheckbox || this.indeterminate)) {
            this.displayCheckbox = [];
            this.filteredPendingList.map(() => { this.displayCheckbox.push(true); });
        } else if (value && !isChecked && !this.indeterminate && !this.mainCheckbox) {
            this.displayCheckbox.splice(index, 1, true);
        } else {
            this.displayCheckbox.splice(0, this.displayCheckbox.length);
            this.filteredPendingList.map(item => { this.displayCheckbox.push(false); });
        }
    }

    /**
     * enable/disable submit button
     * @memberof ApprovalOverrideComponent
     */
    enableDisableButton() {
        if (this.approvalForm.valid && (this.mainCheckbox || this.indeterminate)) {
            this.disableButton = false;
        } else {
            this.disableButton = true;
        }
    }



    /**
     * patch selected user pending approval application 
     * @memberof ApprovalOverrideComponent
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
        this.submitData(body);
    }

    /**
     * patch data to the endpoint
     * @param {*} body
     * @memberof ApprovalOverrideComponent
     */
    submitData(body: any) {
        this.approvalOverrideAPI.patch_approval_override(body).subscribe(response => {
            if (this.approvalForm.controls.radio.value == 'APPROVED') {
                this.approvalOverrideAPI.notification('approved successfully ');
            } else if (this.approvalForm.controls.radio.value == 'REJECTED') {
                this.approvalOverrideAPI.notification('rejected successfully ');
            } else {
                this.approvalOverrideAPI.notification('cancelled successfully ');
            }
            this.showNoResult = false;
            this.showSmallSpinner = false;
            this.approvalForm.get('radio').reset();
            this.approvalForm.get('remark').reset();
            this.mainEvent();
            for (let i = 0; i < this.filteredPendingList.length; i++) {
                this.deleteSubmittedItem(i);
            }
        });
    }

    /**
     * delete submitted items
     * @memberof ApprovalOverrideComponent
     */
    deleteSubmittedItem(i: number) {
        for (let j = 0; j < this.leaveTransactionGUID.length; j++) {
            if (this.filteredPendingList[i].LEAVE_TRANSACTION_GUID == this.leaveTransactionGUID[j]) {
                this.filteredPendingList.splice(i, 1);
            }
        }
    }

}