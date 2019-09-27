import { Component, OnInit } from "@angular/core";
import { roleDetails, options } from "../role-details-data";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RoleApiService } from "../role-api.service";
import { EmployeeTreeviewService } from "../../leave-setup/assign-calendar/employee-treeview.service";
import { APIService } from "src/services/shared-service/api.service";
import { SnackbarNotificationComponent } from "../../leave-setup/snackbar-notification/snackbar-notification.component";
import { MatSnackBar } from "@angular/material";

/**
 * Assign role to employee
 * @export
 * @class AssignRoleComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-assign-role',
    templateUrl: './assign-role.component.html',
    styleUrls: ['./assign-role.component.scss'],
})
export class AssignRoleComponent implements OnInit {

    /**
     * role details from API
     * code, description & property
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public data: any;

    /**
     * role profile list from API
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public list: any;

    /**
     * users list details from API 
     * from api/users
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public users: any;

    /**
     * Loading spinner after reload
     * @type {boolean}
     * @memberof AssignRoleComponent
     */
    public showSpinner: boolean = true;

    /**
     * small spinner loading when requested API
     * @type {boolean}
     * @memberof AssignRoleComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * hide content during loading
     * @type {boolean}
     * @memberof AssignRoleComponent
     */
    public showContent: boolean = false;

    /**
     * show indeterminate in checkbox
     * @type {boolean[]}
     * @memberof AssignRoleComponent
     */
    public indeterminate: boolean[] = [false, false, false];

    /**
     * main checkbox is selected
     * @type {boolean[]}
     * @memberof AssignRoleComponent
     */
    public allowAll: boolean[] = [false, false, false];

    /**
     * option list from select input
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public viewReportList: any;

    /**
     * leave setup checked value
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public getLeaveSetupKey: any;

    /**
     * leave management checked value
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public getLeaveMngtKey: any;

    /**
     * profile management checked value
     *
     * @type {*}
     * @memberof AssignRoleComponent
     */
    public getProfileMngtKey: any;

    /**
     * view calendar checked value
     * @memberof AssignRoleComponent
     */
    public getCalendarKey = [];

    /**
     * view report checked value
     * @memberof AssignRoleComponent
     */
    public getReportKey = [];

    /**
     * form control of role
     * @type {FormGroup}
     * @memberof AssignRoleComponent
     */
    public assignRoleForm: FormGroup;

    /**
     * selected employee name (checkbox)
     * @memberof AssignRoleComponent
     */
    public employeeNameList = [];

    /**
     * rolename value from API
     * @type {string}
     * @memberof AssignRoleComponent
     */
    public rolename: string;

    /**
     * description value from API
     * @type {string}
     * @memberof AssignRoleComponent
     */
    public description: string;

    /**
     * checked employee Id 
     * @type {string[]}
     * @memberof AssignRoleComponent
     */
    public userList: string[] = [];

    /**
     *enable/disable submit button
     * @type {boolean}
     * @memberof AssignRoleComponent
     */
    public submitButton: boolean = true;

    /**
     * Click to show dropdown of treeview checkbox list
     * @type {boolean}
     * @memberof AssignRoleComponent
     */
    public displayDivDropdown: boolean = false;

    /**
     * Show treeview selected value after close dropdown
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public displaySelectedTreeview: boolean = false;

    /**
     * selected role from option list
     * @private
     * @type {string}
     * @memberof AssignRoleComponent
     */
    private _roleId: string;

    /**
     *Creates an instance of AssignRoleComponent.
     * @param {MatSnackBar} snackBar
     * @param {RoleApiService} roleAPi
     * @param {APIService} apiService
     * @param {EmployeeTreeviewService} treeview
     * @memberof AssignRoleComponent
     */
    constructor(private snackBar: MatSnackBar, private roleAPi: RoleApiService, private apiService: APIService, private treeview: EmployeeTreeviewService) {
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

    /**
     * Initial value for role details 
     * @memberof AssignRoleComponent
     */
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

    /**
     * checked event value from checkbox 
     * @memberof AssignRoleComponent
     */
    getChildCheckedValue() {
        this.childCheckbox(this.getLeaveSetupKey, 0);
        this.childCheckbox(this.getReportKey);
        this.childCheckbox(this.getLeaveMngtKey, 1);
        this.childCheckbox(this.getCalendarKey);
        this.childCheckbox(this.getProfileMngtKey, 2);
    }

    /**
     * click on child checkbox to set main checkbox is tick or not
     * @param {*} list
     * @param {number} [mainIndex]
     * @param {number} [childIndex]
     * @memberof AssignRoleComponent
     */
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
     * @memberof AssignRoleComponent
     */
    clickToCloseDiv(event) {
        if (!event.target.className.includes("dropdown") && !event.target.className.includes("material-icons.dropdown-icon") && !event.target.className.includes("mat-form-field-infix")) {
            this.displayDivDropdown = false;
            this.displaySelectedTreeview = true;
            this.disabledSubmit();
        }
        for (let i = 0; i < this.treeview.checklistSelection.selected.length; i++) {
            if (this.treeview.checklistSelection.selected[i].level == 2 && this.employeeNameList.indexOf(this.treeview.checklistSelection.selected[i].item) === -1) {
                this.employeeNameList.push(this.treeview.checklistSelection.selected[i].item);
                this.disabledSubmit();
            }
        }
        if (this.treeview.checklistSelection.selected.length === 0) {
            this.employeeNameList.length = 0;
        }
    }

    /**
     * role is selected from list 
     * pass role id to API and get role details
     * @param {*} roleGuid
     * @memberof AssignRoleComponent
     */
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

    /**
     * method to enable/disable submit button
     * @memberof AssignRoleComponent
     */
    disabledSubmit() {
        if (this.employeeNameList.length > 0 && this.assignRoleForm.controls.role.value != null) {
            this.submitButton = false;
        } else { this.submitButton = true; }
    }

    /**
     * check employee name exist in array 
     * @param {*} list
     * @param {*} nameObj
     * @returns
     * @memberof AssignRoleComponent
     */
    checkNameExist(list: any, nameObj: any) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].employeeName === nameObj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * push selected role Id to Array
     * @memberof AssignRoleComponent
     */
    pushUserId() {
        for (let i = 0; i < this.employeeNameList.length; i++) {
            if (this.checkNameExist(this.users, this.employeeNameList[i]) != 0) {
                const index: number = this.checkNameExist(this.users, this.employeeNameList[i]);
                this.userList.push(this.users[index].userId);
            }
        }
    }

    /**
     * patch the assigned data to employee to API
     * @memberof AssignRoleComponent
     */
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
     * Display message after assigned role to employee
     * @param {string} message
     * @memberof AssignRoleComponent
     */
    alertMessage(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 2500,
            data: message
        });
    }
}