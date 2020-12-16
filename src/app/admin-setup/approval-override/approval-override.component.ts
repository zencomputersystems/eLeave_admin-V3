import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApprovalOverrideApiService } from './approval-override-api.service';
import { MenuController } from '@ionic/angular';
import { ReportApiService } from '../report/report-api.service';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { RoleApiService } from '../role-management/role-api.service';

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
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    @HostBinding('class.menuOverrideOverlay') overlay: boolean;

    /**
     * validation for form field
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public approvalForm: any;

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
     * show
     * @type {boolean}
     * @memberof ApprovalOverrideComponent
     */
    public innerSpinner: boolean = true;

    /**
     * pending approval application list
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public pendingList: any = [];

    /**
     * pending list from API
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public pendingData: any = [];

    /**
     * approval-override history data
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public history: any;

    /**
     * user profile details
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public userProfile: any;

    /**
     * role profile details
     * @type {*}
     * @memberof ApprovalOverrideComponent
     */
    public roleDetails: any;

    /**
     *Creates an instance of ApprovalOverrideComponent.
     * @param {ApprovalOverrideApiService} approvalOverrideAPI
     * @param {RoleApiService} roleApi
     * @param {MenuController} menu
     * @param {ReportApiService} reportApi
     * @param {Platform} approvalOverridePlatform
     * @memberof ApprovalOverrideComponent
     */
    constructor(private approvalOverrideAPI: ApprovalOverrideApiService, private roleApi: RoleApiService, private menu: MenuController, private reportApi: ReportApiService, public approvalOverridePlatform: Platform) {
        this.approvalForm = new FormGroup({
            remark: new FormControl('', Validators.required),
            radio: new FormControl('', Validators.required)
        })
    }

    /**
     * initial method to get list from endpoint
     * @memberof ApprovalOverrideComponent
     */
    async ngOnInit() {
        try {
            let personal = await this.approvalOverrideAPI.apiService.get_personal_user_profile_details().toPromise();
            this.userProfile = personal;
            let roleDetails = await this.roleApi.get_role_details_profile(this.userProfile.roleId).toPromise();
            this.roleDetails = roleDetails;
            let pending = await this.approvalOverrideAPI.get_approval_override_list().toPromise();
            this.pendingData = pending;
            if (this.roleDetails.property.allowLeaveManagement.allowApprovalOverride.value && this.roleDetails.property.allowLeaveManagement.allowApprovalOverride.level === 'Department') {
                let filterDepartment = [];
                this.pendingData.forEach(item => {
                    if (this.userProfile.employeeDepartment === item.departmentName) {
                        filterDepartment.push(item);
                    }
                });
                this.pendingData = filterDepartment;
            }
            this.innerSpinner = false;
            for (let i = 0; i < this.pendingData.length; i++) {
                this.pendingData[i]["isChecked"] = false;
                this.displayCheckbox.push(false);
            }
            this.changeDetails('');
        } catch (error) {
            this.innerSpinner = false;
        }
    }

    /**
     * filter employee name from searchbar 
     * @param {*} searchKeyword
     * @param {*} data
     * @param {*} arg
     * @returns
     * @memberof ApprovalOverrideComponent
     */
    filerSearch(searchKeyword, data, arg) {
        return data.filter(itm => new RegExp(searchKeyword, 'i').test(itm[arg]));
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof ApprovalOverrideComponent
     */
    changeDetails(text: any) {
        this.pendingList = this.pendingData;
        this.pendingList = (text.length > 0) ?
            this.filerSearch(text, this.pendingList, 'employeeName') :
            this.pendingList;
    }

    /**
     * filter by status 
     * @param {string} statusName
     * @memberof ApprovalOverrideComponent
     */
    filterStatus(statusName: string) {
        document.querySelector('ion-searchbar').getInputElement().then((value) => {
            if (value.value === '') {
                this.innerSpinner = true;
                this.approvalOverrideAPI.get_approval_override_list().subscribe(pending => {
                    this.pendingData = pending;
                    this.innerSpinner = false;
                    this.getPendingNewList(statusName);
                });
            } else {
                this.getPendingNewList(statusName);
            }
        });
    }

    /**
     * get filtered status list
     * @param {string} statusName
     * @memberof ApprovalOverrideComponent
     */
    getPendingNewList(statusName: string) {
        this.pendingList = this.pendingData;
        this.pendingList = (statusName.length > 0) ?
            this.filerSearch(statusName, this.pendingList, 'status') :
            this.pendingList;
    }

    /**
     * open side menu to view history
     * @memberof ApprovalOverrideComponent
     */
    openMenu() {
        this.menu.open('approvalOverrideDetails');
        this.menu.enable(true, 'approvalOverrideDetails');
        this.overlay = true;
        this.reportApi.get_bundle_report('approval-override').pipe(
            map(data => data.sort((x, y) => new Date(y.applicationDate).getTime() - new Date(x.applicationDate).getTime()))
        ).subscribe(data => this.history = data);
    }

    /**
     * value of main checkbox & indetermine
     * @memberof ApprovalOverrideComponent
     */
    mainEvent() {
        this.displayCheckbox.splice(0, this.displayCheckbox.length);
        setTimeout(() => {
            this.pendingData.forEach(item => {
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
        const total = this.pendingData.length;
        let checkedItem = 0;
        this.pendingData.map(item => {
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
     * @param {boolean} value
     * @param {number} index
     * @param {boolean} isChecked
     * @memberof ApprovalOverrideComponent
     */
    mouseEvent(value: boolean, index: number, isChecked: boolean) {
        if (this.mainCheckbox || this.indeterminate) {
            this.displayCheckbox = [];
            this.displayCheckbox.push(...Array(this.pendingData.length).fill(true));
        } else if (value && !isChecked && !this.indeterminate && !this.mainCheckbox) {
            this.displayCheckbox.splice(index, 1, true);
        } else {
            this.displayCheckbox.splice(0, this.displayCheckbox.length);
            this.displayCheckbox.push(...Array(this.pendingData.length).fill(false));
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
        this.pendingData.forEach((element, i) => {
            if (element.isChecked) {
                this.leaveTransactionGUID.push(this.pendingData[i].leaveTransactionId);
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
     * clear all form
     * @memberof ApprovalOverrideComponent
     */
    clearValue() {
        this.approvalForm.get('radio').reset();
        this.approvalForm.get('remark').reset();
        this.mainEvent();
        this.leaveTransactionGUID = [];
        this.ngOnInit();
        this.enableDisableButton();
    }

    /**
     * patch data to the endpoint
     * @param {*} body
     * @memberof ApprovalOverrideComponent
     */
    submitData(body: any) {
        this.approvalOverrideAPI.patch_approval_override(body).subscribe(response => {
            if (response[0].USER_GUID != undefined) {
                this.approvalOverrideAPI.notification('You have submitted successfully', true);
            } else {
                this.approvalOverrideAPI.notification(response.status, false);
            }
            this.showSmallSpinner = false;
            this.clearValue();
            document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
                searchInput.value = '';
                this.changeDetails('');
            });
        }, error => {
            this.approvalOverrideAPI.notification(error.statusText, false);
        });
    }

}