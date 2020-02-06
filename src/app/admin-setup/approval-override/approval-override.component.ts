import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApprovalOverrideApiService } from './approval-override-api.service';
import { MenuController } from '@ionic/angular';

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
     *Creates an instance of ApprovalOverrideComponent.
     * @param {ApprovalOverrideApiService} approvalOverrideAPI
     * @memberof ApprovalOverrideComponent
     */
    constructor(private approvalOverrideAPI: ApprovalOverrideApiService, private menu: MenuController) {
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
        let pending = await this.approvalOverrideAPI.get_approval_override_list().toPromise();
        this.pendingList = pending;
        this.innerSpinner = false;
        for (let i = 0; i < this.pendingList.length; i++) {
            this.pendingList[i]["isChecked"] = false;
            this.displayCheckbox.push(false);
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof ApprovalOverrideComponent
     */
    changeDetails(text: any) {
        this.innerSpinner = true;
        if (text === '') {
            this.ngOnInit();
        } else {
            this.filter(text);
        }
    }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof ApprovalOverrideComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let username = this.pendingList.filter((user: any) => {
                return (user.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let departmentName = this.pendingList.filter((department: any) => {
                if (department.departmentName != undefined) {
                    return (department.departmentName.toLowerCase().indexOf(text.toLowerCase()) > -1);
                }
            })
            let companyName = this.pendingList.filter((company: any) => {
                if (company.companyName != undefined) {
                    return (company.companyName.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })
            this.innerSpinner = false;
            this.pendingList = require('lodash').uniqBy(username.concat(departmentName).concat(companyName), 'leaveTransactionId');
        }
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
                    this.pendingList = pending;
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
        let statusList = this.pendingList.filter((status: any) => {
            return (status.status.toLowerCase().indexOf(statusName.toLowerCase()) > -1)
        })
        this.pendingList = statusList;
    }

    /**
     * open side menu to view history
     * @memberof ApprovalOverrideComponent
     */
    openMenu() {
        this.menu.open('approvalOverrideDetails');
        this.menu.enable(true, 'approvalOverrideDetails');
        this.overlay = true;
    }

    /**
     * value of main checkbox & indetermine
     * @memberof ApprovalOverrideComponent
     */
    mainEvent() {
        this.displayCheckbox.splice(0, this.displayCheckbox.length);
        setTimeout(() => {
            this.pendingList.forEach(item => {
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
        const total = this.pendingList.length;
        let checkedItem = 0;
        this.pendingList.map(item => {
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
            this.displayCheckbox.push(...Array(this.pendingList.length).fill(true));
        } else if (value && !isChecked && !this.indeterminate && !this.mainCheckbox) {
            this.displayCheckbox.splice(index, 1, true);
        } else {
            this.displayCheckbox.splice(0, this.displayCheckbox.length);
            this.displayCheckbox.push(...Array(this.pendingList.length).fill(false));
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
        this.pendingList.forEach((element, i) => {
            if (element.isChecked) {
                this.leaveTransactionGUID.push(this.pendingList[i].leaveTransactionId);
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
            this.approvalOverrideAPI.notification(JSON.parse(error._body).status, false);
        });
    }

}