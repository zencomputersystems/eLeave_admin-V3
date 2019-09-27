import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { APIService } from "src/services/shared-service/api.service";
import { LeaveApiService } from "../../leave-api.service";
import { SnackbarNotificationComponent } from "../../snackbar-notification/snackbar-notification.component";
import { WorkingHourApiService } from "../working-hour-api.service";
/**
 * assign working hour profile to user
 * @export
 * @class AssignWorkingHourComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-assign-working-hour',
    templateUrl: './assign-working-hour.component.html',
    styleUrls: ['./assign-working-hour.component.scss'],
})
export class AssignWorkingHourComponent implements OnInit {

    /**
     * validation group 
     * @type {*}
     * @memberof AssignWorkingHourComponent
     */
    public workingHrForm: any;

    /**
     * company list from API
     * @type {*}
     * @memberof AssignWorkingHourComponent
     */
    public company: any;

    /**
     * department list from API
     * @type {*}
     * @memberof AssignWorkingHourComponent
     */
    public departmentItems: any;

    /**
     * leavetype list from API
     * @type {*}
     * @memberof AssignWorkingHourComponent
     */
    public workingHrProfileList: any;

    /**
     * filter users from selected company and department
     * @type {any[]}
     * @memberof AssignWorkingHourComponent
     */
    public filteredUser: any[] = [];


    /**
     * enable/disable submit button according required item
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public submitButton: boolean = true;

    /**
     * value of main checkbox
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public checkboxVal: boolean;

    /**
     * value of indeterminate in main checkbox
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public line: boolean;

    /**
     * hover value of show/hide checkbox
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public showTickbox: boolean[] = [];

    /**
     * show/hide spinner when submit button is clicked
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public smallSpinner: boolean = false;

    /**
     * show/hide spinner when company & department selection is clicked
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    public showNoSearchFound: boolean = false;

    /**
     * selected company guid
     * @private
     * @type {string}
     * @memberof AssignWorkingHourComponent
     */
    private _companyID: string;

    /**
     * user list from API
     * @private
     * @type {*}
     * @memberof AssignWorkingHourComponent
     */
    private _userItem: any;

    /**
     * selected user details from user list
     * @private
     * @type {any[]}
     * @memberof AssignWorkingHourComponent
     */
    private _selectedUserItem: any[] = [];

    /**
     * show assign page input
     * @type {boolean}
     * @memberof AssignWorkingHourComponent
     */
    @Input() showAssignPage: boolean = true;

    /**
     * emit value to hide this page after clicked back button
     * @memberof AssignWorkingHourComponent
     */
    @Output() backToList = new EventEmitter();

    /**
     *Creates an instance of AssignWorkingHourComponent.
     * @param {LeaveApiService} leaveSetupAPI
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof AssignWorkingHourComponent
     */
    constructor(private leaveSetupAPI: LeaveApiService, private apiService: APIService, private workingHrAPI: WorkingHourApiService) {
        this.workingHrForm = new FormGroup({
            profile: new FormControl('', Validators.required),
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
        })
    }

    ngOnInit() {
        this.leaveSetupAPI.get_company_list().subscribe(list => this.company = list);
        this.workingHrAPI.get_working_hours_profile_list().subscribe(data => this.workingHrProfileList = data);
    }

    /**
     * select company & pass company guid to get department list
     * @param {*} id
     * @memberof AssignWorkingHourComponent
     */
    companyList(id: string) {
        this.showSpinner = true;
        this._companyID = id;
        this.leaveSetupAPI.get_company_details(id).subscribe(list => {
            this.departmentItems = list.departmentList;
            this.showSpinner = false;
        })
    }

    /**
     * get user list from API
     * @param {*} employeeName
     * @memberof AssignWorkingHourComponent
     */
    departmentList(employeeName: string) {
        this.filteredUser = [];
        this.showSpinner = true;
        this.apiService.get_user_profile_list().subscribe(items => {
            this._userItem = items;
            this.showSpinner = false;
            this.filterUser(this._userItem, employeeName);
        })
    }

    /**
     * get entitled leave balance from requested userID 
     * @param {*} workingHrGUID
     * @memberof AssignWorkingHourComponent
     */
    // getWorkingProfile(workingHrGUID) {
    //     for (let i = 0; i < this.filteredUserItems.length; i++) {
    //         this.leaveSetupAPI.get_entilement_details(this.filteredUserItems[i].userId).subscribe(data => {
    //             for (let j = 0; j < data.length; j++) {
    //                 if (data[j].LEAVE_TYPE_GUID === workingHrGUID)
    //                     this.filteredUserItems[i].entitlement = data[j].ENTITLED_DAYS;
    //             }
    //         })
    //     }
    // }

    /**
     * get user list to filter from selected compant & department
     * @param {*} data
     * @param {string} employeeName
     * @memberof AssignWorkingHourComponent
     */
    filterUser(data: any, employeeName: string) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].department === employeeName && data[i].companyId === this._companyID) {
                this.filteredUser.push(data[i]);
                this.filteredUser[this.filteredUser.length - 1].isChecked = false;
                this.showTickbox.push(false);
            }
        }
        if (this.filteredUser.length > 0) {
            this.showNoSearchFound = false;
        } else {
            this.showNoSearchFound = true;
        }
    }

    /**
     * checking to enable/disable submit button
     * @memberof AssignWorkingHourComponent
     */
    enableDisableSubmitButton() {
        if (this.workingHrForm.valid && (this.checkboxVal || this.line)) {
            this.submitButton = false;
        } else {
            this.submitButton = true;
        }
    }

    /**
     * mouse hover to show/hide checkbox
     * @param {number} index
     * @param {boolean} inOut
     * @param {boolean} check
     * @memberof AssignWorkingHourComponent
     */
    mouseEvent(index: number, inOut: boolean, check: boolean) {
        if (check && (this.checkboxVal || this.line)) {
            this.showTickbox = [];
            this.filteredUser.map(val => { this.showTickbox.push(true); });
        } else if (!check && (this.checkboxVal || this.line)) {
            this.showTickbox.splice(0, this.showTickbox.length);
            this.filteredUser.map(list => { this.showTickbox.push(true); });
        } else if (inOut && !check && !this.line && !this.checkboxVal) {
            this.showTickbox.splice(index, 1, true);
        } else {
            this.showTickbox.splice(0, this.showTickbox.length);
            this.filteredUser.map(list => { this.showTickbox.push(false); });
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof AssignWorkingHourComponent
     */
    checkMainEvent() {
        this.showTickbox.splice(0, this.showTickbox.length);
        setTimeout(() => {
            this.filteredUser.forEach(data => {
                data.isChecked = this.checkboxVal;
                if (data.isChecked) {
                    this.showTickbox.push(true);
                } else {
                    this.showTickbox.push(false);
                }
                this.enableDisableSubmitButton();
            });
        })
    }

    /**
     * check sub checkbox to make changing in main checkbox (interminate/mainCheckBox)
     * @memberof AssignWorkingHourComponent
     */
    checkItemsEvent() {
        const total = this.filteredUser.length;
        let checkedItem = 0;
        this.filteredUser.map(point => {
            if (point.isChecked) {
                checkedItem++;
                this.showTickbox.push(true);
            }
        });
        if (checkedItem > 0 && checkedItem < total) {
            this.line = true;
            this.checkboxVal = false;
        } else if (checkedItem == total) {
            this.checkboxVal = true;
            this.line = false;
        } else {
            this.line = false;
            this.checkboxVal = false;
        }
        this.enableDisableSubmitButton();
    }

    /**
     * show pop up snackbar
     * @param {string} statement
     * @memberof AssignWorkingHourComponent
     */
    openNotification(statement: string) {
        this.leaveSetupAPI.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            data: statement
        });
    }

    /**
     * click back to hide the details page
     * @param {boolean} value
     * @memberof WorkingHourPage
     */
    hideAssignPage(value: boolean) {
        this.backToList.emit(value);
    }



}