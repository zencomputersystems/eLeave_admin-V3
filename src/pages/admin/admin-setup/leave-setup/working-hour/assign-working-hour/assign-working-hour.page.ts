import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { APIService } from "src/services/shared-service/api.service";
import { LeaveAPIService } from "../../leave-api.service";
import { SnackbarNotificationPage } from "../../snackbar-notification/snackbar-notification";
import { WorkingHourAPIService } from "../working-hour-api.service";
/**
 * assign working hour profile to user
 * @export
 * @class AssignWorkingHourPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-assign-working-hour',
    templateUrl: './assign-working-hour.page.html',
    styleUrls: ['./assign-working-hour.page.scss'],
})
export class AssignWorkingHourPage implements OnInit {

    /**
     * validation group 
     * @type {*}
     * @memberof AssignWorkingHourPage
     */
    public workingHrForm: any;

    /**
     * company list from API
     * @type {*}
     * @memberof AssignWorkingHourPage
     */
    public company: any;

    /**
     * department list from API
     * @type {*}
     * @memberof AssignWorkingHourPage
     */
    public departmentItems: any;

    /**
     * leavetype list from API
     * @type {*}
     * @memberof AssignWorkingHourPage
     */
    public workingHrProfileList: any;

    /**
     * filter users from selected company and department
     * @type {any[]}
     * @memberof AssignWorkingHourPage
     */
    public filteredUser: any[] = [];


    /**
     * enable/disable submit button according required item
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public submitButton: boolean = true;

    /**
     * value of main checkbox
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public checkboxVal: boolean;

    /**
     * value of indeterminate in main checkbox
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public line: boolean;

    /**
     * hover value of show/hide checkbox
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public showTickbox: boolean[] = [];

    /**
     * show/hide spinner when submit button is clicked
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public smallSpinner: boolean = false;

    /**
     * show/hide spinner when company & department selection is clicked
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    public showNoSearchFound: boolean = false;

    /**
     * selected company guid
     * @private
     * @type {string}
     * @memberof AssignWorkingHourPage
     */
    private _companyID: string;

    /**
     * user list from API
     * @private
     * @type {*}
     * @memberof AssignWorkingHourPage
     */
    private _userItem: any;

    /**
     * selected user details from user list
     * @private
     * @type {any[]}
     * @memberof AssignWorkingHourPage
     */
    private _selectedUserItem: any[] = [];

    /**
     * show assign page input
     * @type {boolean}
     * @memberof AssignWorkingHourPage
     */
    @Input() showAssignPage: boolean = true;

    /**
     * emit value to hide this page after clicked back button
     * @memberof AssignWorkingHourPage
     */
    @Output() backToList = new EventEmitter();

    /**
     *Creates an instance of AssignWorkingHourPage.
     * @param {LeaveAPIService} leaveSetupAPI
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof AssignWorkingHourPage
     */
    constructor(private leaveSetupAPI: LeaveAPIService, private apiService: APIService, private workingHrAPI: WorkingHourAPIService) {
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
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
     * @memberof AssignWorkingHourPage
     */
    openNotification(statement: string) {
        this.leaveSetupAPI.snackBar.openFromComponent(SnackbarNotificationPage, {
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