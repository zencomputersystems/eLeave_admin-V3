import { OnInit, Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PolicyAPIService } from "../policy-api.service";
import { LeaveAPIService } from "../../leave-setup/leave-api.service";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationPage } from "../../leave-setup/snackbar-notification/snackbar-notification";
import { ActivatedRoute } from "@angular/router";

/**
 * create new general leave policy & edit policy page
 * @export
 * @class CreatePolicyPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-create-policy',
    templateUrl: './create-policy.page.html',
    styleUrls: ['./create-policy.page.scss'],
})
export class CreatePolicyPage implements OnInit {

    /**
     * company list from API
     * @type {*}
     * @memberof CreatePolicyPage
     */
    public list: any;

    /**
     * All tenant policy list and details
     * @type {*}
     * @memberof CreatePolicyPage
     */
    public policyList: any;

    /**
     * show edit policy page when URL is edit-policy
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public showEditPolicy: boolean = false;

    /**
     * show spinner during loading page
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public showSpinner: boolean = true;

    /**
     * hide container during loading page
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public showContainer: boolean = false;

    /**
     * mat radio button value 
     * @type {*}
     * @memberof CreatePolicyPage
     */
    public radioValue: any;

    /**
     * number of escalation day 
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public showEscalateDay: boolean = false;

    /**
     * array list of days in a selected month in carried forward field
     * eg: 1 to 30
     * @type {number[]}
     * @memberof CreatePolicyPage
     */
    public daysOfCF: number[];

    /**
     * array list of days in a selected month in year end closing field
     * eg: 1 to 30
     * @type {number[]}
     * @memberof CreatePolicyPage
     */
    public daysOfYE: number[];

    /**
     * carried forward checkbox value
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public CF: boolean = false;

    /**
     * year end closing checkbox value
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public yearEnd: boolean = false;

    /**
     * apply on behalf checkbox value
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public onBehalf: boolean = false;

    /**
     * email checkbox value
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public email: boolean = false;

    /**
     * validation form value
     * @type {*}
     * @memberof CreatePolicyPage
     */
    public policyForm: any;

    /**
     * show loading spinner when clicked on create policy to API
     * @type {boolean}
     * @memberof CreatePolicyPage
     */
    public showSmallSpinner: boolean = false;

    /**
     * to get index of selected month 
     * @private
     * @memberof CreatePolicyPage
     */
    private _monthArray = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

    /**
     * next year number
     * eg: 2020
     * @private
     * @memberof CreatePolicyPage
     */
    private _nextYear = new Date().getFullYear() + 1;

    /**
     * empty object 
     * @private
     * @type {*}
     * @memberof CreatePolicyPage
     */
    private _data: any = {};

    /**
     * Selected policy GUID (to patch to endpoint)
     * @private
     * @type {string}
     * @memberof CreatePolicyPage
     */
    private _policyGUID: string;

    /**
     * company guid id from url parameter
     * @private
     * @type {string}
     * @memberof CreatePolicyPage
     */
    private _companyGUID: string;

    /**
     *Creates an instance of CreatePolicyPage.
     * @param {PolicyAPIService} policyApi
     * @param {LeaveAPIService} leaveAPi
     * @param {MatSnackBar} snackbar
     * @param {ActivatedRoute} route
     * @memberof CreatePolicyPage
     */
    constructor(private policyApi: PolicyAPIService, private leaveAPi: LeaveAPIService, private snackbar: MatSnackBar, private route: ActivatedRoute) {
        this.policyForm = new FormGroup(
            {
                company: new FormControl(null, Validators.required),
                anyoneLevel: new FormControl(null, Validators.required),
                everyoneLevel: new FormControl(null, Validators.required),
                escalateAfterDays: new FormControl(null, Validators.required),
                CFMonth: new FormControl({ value: null, disabled: true }, Validators.required),
                CFDay: new FormControl({ value: null, disabled: true }, Validators.required),
                YEMonth: new FormControl({ value: null, disabled: true }, Validators.required),
                YEDay: new FormControl({ value: null, disabled: true }, Validators.required),
                YEChoice: new FormControl({ value: 'Next year', disabled: true }, Validators.required)
            });
    }

    ngOnInit() {
        if (this.route.routeConfig.path.includes('edit-policy')) {
            this.route.params.subscribe(params => { this._companyGUID = params.id; });
            this.showEditPolicy = true;
            this.policyApi.get_general_leave_policy_id(this._companyGUID).subscribe(list => {
                this.policyList = list;
                this.editPolicyDetails();
            })
        }
        this.leaveAPi.get_compant_list().subscribe(data => {
            this.list = data;
            this.showContainer = true;
            this.showSpinner = false;
        }, error => {
            window.location.href = '/login';
        })
    }

    /**
     * get the details from Id of company GUID
     * @memberof CreatePolicyPage
     */
    editPolicyDetails() {
        this._policyGUID = this.policyList.MAIN_GENERAL_POLICY_GUID;
        this.policyForm.controls.company.value = this.policyList.PROPERTIES_XML.tenantCompanyId;
        this.radioValue = this.policyList.PROPERTIES_XML.approvalConfirmation.requirement;
        if (this.radioValue == 'Anyone') {
            this.policyForm.controls.anyoneLevel.value = this.policyList.PROPERTIES_XML.approvalConfirmation.approvalLevel;
        } else {
            this.policyForm.controls.everyoneLevel.value = this.policyList.PROPERTIES_XML.approvalConfirmation.approvalLevel;
        }
        this.policyForm.controls.escalateAfterDays.value = this.policyList.PROPERTIES_XML.approvalConfirmation.escalateAfterDays;
        this.CF = this.policyList.PROPERTIES_XML.forfeitCFLeave.value;
        this.policyForm.controls.CFMonth.value = this.policyList.PROPERTIES_XML.forfeitCFLeave.month;
        this.policyForm.controls.CFDay.value = this.policyList.PROPERTIES_XML.forfeitCFLeave.day;
        this.yearEnd = this.policyList.PROPERTIES_XML.allowYearEndClosing.value;
        this.policyForm.controls.YEMonth.value = this.policyList.PROPERTIES_XML.allowYearEndClosing.month;
        this.policyForm.controls.YEDay.value = this.policyList.PROPERTIES_XML.allowYearEndClosing.day;
        this.policyForm.controls.YEChoice.value = this.policyList.PROPERTIES_XML.allowYearEndClosing.relativeYear;
        this.onBehalf = this.policyList.PROPERTIES_XML.applyOnBehalfConfirmation;
        this.email = this.policyList.PROPERTIES_XML.emailReminder;
        this.yearChanged(this.policyForm.controls.YEChoice.value);
        this.monthChanged('monthCF', 0);
        this.policyForm.controls.CFMonth.enable();
        this.policyForm.controls.CFDay.enable();
        this.policyForm.controls.YEMonth.enable();
        this.policyForm.controls.YEDay.enable();
        this.policyForm.controls.YEChoice.enable();
    }

    /**
     * Get total number of day in a selected month and year
     * @param {*} month
     * @param {*} year
     * @returns
     * @memberof CreatePolicyPage
     */
    getTotalDays(month, year) {
        return new Date(year, month, 0).getDate();
    };

    /**
     * Get total number of days in a month if selection month is changed
     * @param {string} model
     * @param {number} [year]
     * @memberof CreatePolicyPage
     */
    monthChanged(model: string, year?: number) {
        if (year == undefined || this.policyForm.controls.YEChoice.value == 'Next year') { year = 0 } else { year = 1 }
        if (model == 'monthCF') {
            const monthCF = this._monthArray.indexOf(this.policyForm.controls.CFMonth.value) + 1;
            let dayCF = this.getTotalDays(monthCF, this._nextYear);
            this.daysOfCF = [];
            for (let i = 1; i < dayCF + 1; i++) {
                this.daysOfCF.push(i);
            }
        } else {
            const monthYE = this._monthArray.indexOf(this.policyForm.controls.YEMonth.value) + 1;
            let dayYE = this.getTotalDays(monthYE, this._nextYear - year);
            this.daysOfYE = [];
            for (let i = 1; i < dayYE + 1; i++) {
                this.daysOfYE.push(i);
            }
        }
    }

    /**
     * Get total number of days in a month if selection year is changed
     * @param {*} event
     * @memberof CreatePolicyPage
     */
    yearChanged(value) {
        if (value == 'This year') {
            this.monthChanged('monthYE', 1);
        } else {
            this.monthChanged('monthYE', 0);
        }
    }

    /**
     * When ion-checkbox is clicked, the selection/input form is enable/disable
     * @param {*} event
     * @param {*} enabledMonth
     * @param {*} enabledDay
     * @param {*} [enabledYr]
     * @memberof CreatePolicyPage
     */
    checkEvent(event, enabledMonth, enabledDay, enabledYr?: any) {
        if (event.detail.checked) {
            enabledMonth.enable();
            enabledDay.enable();
            if (enabledYr != undefined) {
                enabledYr.enable();
            }
        } else {
            enabledMonth.disable();
            enabledDay.disable();
            if (enabledYr != undefined) {
                enabledYr.disable();
            }
        }
    }

    /**
     * data that created to POST to backend API
     * @memberof CreatePolicyPage
     */
    getValue() {
        this._data.approvalConfirmation = {};
        this._data.approvalConfirmation.requirement = this.radioValue;
        if (this.radioValue == 'Anyone') {
            this._data.approvalConfirmation.approvalLevel = Number(this.policyForm.controls.anyoneLevel.value);
        } else {
            this._data.approvalConfirmation.approvalLevel = Number(this.policyForm.controls.everyoneLevel.value);
        }
        this._data.approvalConfirmation.escalateAfterDays = Number(this.policyForm.controls.escalateAfterDays.value);
        this._data.forfeitCFLeave = {};
        this._data.forfeitCFLeave.value = this.CF;
        this._data.forfeitCFLeave.day = this.policyForm.controls.CFDay.value;
        this._data.forfeitCFLeave.month = this.policyForm.controls.CFMonth.value;
        this._data.allowYearEndClosing = {};
        this._data.allowYearEndClosing.value = this.yearEnd;
        this._data.allowYearEndClosing.day = this.policyForm.controls.YEDay.value;
        this._data.allowYearEndClosing.month = this.policyForm.controls.YEMonth.value;
        this._data.allowYearEndClosing.relativeYear = this.policyForm.controls.YEChoice.value;
        this._data.applyOnBehalfConfirmation = this.onBehalf;
        this._data.emailReminder = this.email;
        this._data.tenantCompanyId = this.policyForm.controls.company.value;
    }

    /**
     * POST data to backend API
     * @memberof CreatePolicyPage
     */
    createPolicy() {
        this.getValue();
        this.showSmallSpinner = true;
        this.policyApi.post_general_leave_policy(this._data).subscribe(success => {
            this.showSmallSpinner = false;
            this.policyForm.reset();
            this.radioValue = null;
            this.CF = false;
            this.yearEnd = false;
            this.onBehalf = false;
            this.email = false;
            this.message('saved successfully');
        }, error => {
            window.location.href = '/login';
            this.message('saved unsuccessfully');
        });
    }
    /**
     * Update the policy details and PATCH to endpoint
     * @memberof CreatePolicyPage
     */
    savePolicy() {
        this.showSmallSpinner = true;
        this.getValue();
        const data = {
            'generalPolicyId': this._policyGUID,
            'data': this._data
        }
        this.policyApi.patch_general_leave_policy(data).subscribe(response => {
            this.message('saved successfully');
            this.showSmallSpinner = false;
        }, error => {
            window.location.href = '/login';
            this.message('saved unsuccessfully');
        })
    }

    /**
     * show notifation snackbar after clicked create policy
     * @param {string} message
     * @memberof CreatePolicyPage
     */
    message(message: string) {
        this.snackbar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }
}