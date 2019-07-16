import { Component, OnInit } from "@angular/core";
import { roleDetails, options } from "../role-details-data";
import { FormGroup, FormBuilder } from "@angular/forms";
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
    public isIndeterminate: boolean[] = [false, false, false];
    public mainCheckbox: boolean[] = [false, false, false];
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
    /**
     * Click to show dropdown of treeview checkbox list
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public showTreeDropdown: boolean = false;

    /**
     * Show treeview selected value after close dropdown
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public showSelectedTree: boolean = false;
    private _roleId: string;

    constructor(fb: FormBuilder, private snackBar: MatSnackBar, private roleAPi: RolesAPIService, private apiService: APIService, private treeview: EmployeeTreeview) {
        this.assignRoleForm = fb.group({
            role: null,
        });
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
        this.checkEvent(this.getLeaveSetupKey, 0);
        this.checkEvent(this.getReportKey);
        this.checkEvent(this.getLeaveMngtKey, 1);
        this.checkEvent(this.getCalendarKey);
        this.checkEvent(this.getProfileMngtKey, 2);
    }

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
     * Closed div after clicked outside of div
     * Push all items to array if they have checked
     * Clear array if no item checked
     * @param {*} event
     * @memberof AssignCalendarPage
     */
    clickToCloseDiv(event) {
        if (!event.target.className.includes("inputDropdown") && !event.target.className.includes("material-icons") && !event.target.className.includes("mat-form-field-infix")) {
            this.showTreeDropdown = false;
            this.showSelectedTree = true;
        }
        for (let i = 0; i < this.treeview.checklistSelection.selected.length; i++) {
            if (this.treeview.checklistSelection.selected[i].level == 1 && this.employeeNameList.indexOf(this.treeview.checklistSelection.selected[i].item) === -1) {
                this.employeeNameList.push(this.treeview.checklistSelection.selected[i].item)
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
                this.getInit();
            })
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
            this.showSelectedTree = false;
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