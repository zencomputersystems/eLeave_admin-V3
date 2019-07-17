import { Component, OnInit } from "@angular/core";
import { roleDetails, options } from "../role-details-data";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RolesAPIService } from "../role-api.service";
import { EmployeeTreeview } from "../../public-holiday-setup/assign-calendar/employee-treeview.service";
import { APIService } from "src/services/shared-service/api.service";
import { SnackbarNotificationPage } from "../../public-holiday-setup/snackbar-notification/snackbar-notification";
import { MatSnackBar } from "@angular/material";

@Component({
    selector: 'app-assign-role',
    templateUrl: './assign-role.page.html',
    styleUrls: ['./assign-role.page.scss'],
})
export class AssignRolePage implements OnInit {

    public data: any;
    public list: any;
    public users: any;
    public showSpinner: boolean = true;
    public showSmallSpinner: boolean = false;
    public showContent: boolean = false;
    public indeterminate: boolean[] = [false, false, false];
    public allowAll: boolean[] = [false, false, false];
    public viewReportList: any;
    public getLeaveSetupKey: any;
    public getLeaveMngtKey: any;
    public getProfileMngtKey: any;
    public getCalendarKey = [];
    public getReportKey = [];
    public assignRoleForm: FormGroup;
    public employeeNameList = [];
    public rolename: string;
    public description: string;
    public userList: string[] = [];
    public submitButton: boolean = true;
    /**
     * Click to show dropdown of treeview checkbox list
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public displayDivDropdown: boolean = false;

    /**
     * Show treeview selected value after close dropdown
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public displaySelectedTreeview: boolean = false;
    private _roleId: string;

    constructor(private snackBar: MatSnackBar, private roleAPi: RolesAPIService, private apiService: APIService, private treeview: EmployeeTreeview) {
        this.assignRoleForm = new FormGroup(
            { role: new FormControl(null, Validators.required) });
    }

    ngOnInit() {
        this.viewReportList = options;
        this.data = roleDetails;
        this.roleAPi.get_role_profile_list().subscribe(list => {
            this.list = list;
            this.showSpinner = false;
            this.showContent = true;
            this.getInit();
        }, error => {
            window.location.href = '/login';
        });
        this.apiService.get_user_profile_list().subscribe(
            data => {
                this.users = data;
            });
    }

    getInit() {
        this.showSpinner = false;
        this.showContent = true;
        this.getLeaveSetupKey = Object.keys(this.data.property.allowLeaveSetup).map(key => this.data.property.allowLeaveSetup[key]);
        this.getLeaveMngtKey = Object.keys(this.data.property.allowLeaveManagement).map(value => this.data.property.allowLeaveManagement[value]);
        this.getProfileMngtKey = Object.keys(this.data.property.allowProfileManagement).map(value => this.data.property.allowProfileManagement[value]);
        this.getCalendarKey.push(this.data.property.allowViewCalendar);
        this.getReportKey.push(this.data.property.allowViewReport);
        this.getChildCheckedValue();
    }

    getChildCheckedValue() {
        this.childCheckbox(this.getLeaveSetupKey, 0);
        this.childCheckbox(this.getReportKey);
        this.childCheckbox(this.getLeaveMngtKey, 1);
        this.childCheckbox(this.getCalendarKey);
        this.childCheckbox(this.getProfileMngtKey, 2);
    }

    childCheckbox(list: any, mainIndex?: number, childIndex?: number) {
        const itemsNum = list.length;
        let isChecked = 0;
        list.map(obj => {
            if (obj.value) isChecked++
            if (!obj.value && childIndex > -1) { list[childIndex].level = '' }
        });
        if (isChecked > 0 && isChecked < itemsNum) {
            this.indeterminate[mainIndex] = true;
            this.allowAll[mainIndex] = false;
        } else if (isChecked == itemsNum) {
            this.allowAll[mainIndex] = true;
            this.indeterminate[mainIndex] = false;
        } else {
            this.indeterminate[mainIndex] = false;
            this.allowAll[mainIndex] = false;
        }
    }

    /**
     * Closed div after clicked outside of div
     * Push all items to array if they have checked
     * Clear array if no item checked
     * @param {*} event
     * @memberof AssignCalendarPage
     */
    clickToCloseDiv(event) {
        if (!event.target.className.includes("dropdown") && !event.target.className.includes("material-icons.dropdown-icon") && !event.target.className.includes("mat-form-field-infix")) {
            this.displayDivDropdown = false;
            this.displaySelectedTreeview = true;
            this.disabledSubmit();
        }
        for (let i = 0; i < this.treeview.checklistSelection.selected.length; i++) {
            if (this.treeview.checklistSelection.selected[i].level == 1 && this.employeeNameList.indexOf(this.treeview.checklistSelection.selected[i].item) === -1) {
                this.employeeNameList.push(this.treeview.checklistSelection.selected[i].item);
                this.disabledSubmit();
            }
        }
        if (this.treeview.checklistSelection.selected.length === 0) {
            this.employeeNameList.length = 0;
        }
    }

    roleSelected(roleGuid) {
        this.showSmallSpinner = true;
        this._roleId = roleGuid;
        this.roleAPi.get_role_details_profile(roleGuid).subscribe(
            (data: any) => {
                this.data = data;
                this.rolename = this.data.code;
                this.description = this.data.description;
                this.showSmallSpinner = false;
                this.disabledSubmit();
                this.getInit();
            })
    }

    disabledSubmit() {
        if (this.employeeNameList.length > 0 && this.assignRoleForm.controls.role.value != null) {
            this.submitButton = false;
        } else { this.submitButton = true; }
    }

    checkNameExist(list: any, nameObj: any) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].employeeName === nameObj) {
                return j;
            }
        }
        return 0;
    }

    pushUserId() {
        for (let i = 0; i < this.employeeNameList.length; i++) {
            if (this.checkNameExist(this.users, this.employeeNameList[i]) != 0) {
                const index: number = this.checkNameExist(this.users, this.employeeNameList[i]);
                this.userList.push(this.users[index].id);
            }
        }
    }

    assignData() {
        this.pushUserId();
        this.roleAPi.patch_user_profile({
            "user_guid": this.userList, "role_guid": this._roleId
        }).subscribe(response => {
            this.showSmallSpinner = false;
            this.assignRoleForm.reset({ role: null });
            this.displaySelectedTreeview = false;
            this.userList = [];
            this.treeview.checklistSelection.clear();
            this.alertMessage('submitted successfully');
            this.data = roleDetails;
            this.getInit();
        }, error => {
            this.alertMessage('submitted unsuccessfully');
            window.location.href = '/login';
        })
    }

    /**
     * Display message after submitted calendar profile
     * @param {string} message
     * @memberof AssignCalendarPage
     */
    alertMessage(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }
}