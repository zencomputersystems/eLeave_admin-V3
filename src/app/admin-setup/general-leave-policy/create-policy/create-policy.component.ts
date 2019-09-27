import { OnInit, Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PolicyAPIService } from "../policy-api.service";
import { ActivatedRoute } from "@angular/router";

/**
 * create new general leave policy & edit policy page
 * @export
 * @class CreatePolicyPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-create-policy',
    templateUrl: './create-policy.component.html',
    styleUrls: ['./create-policy.component.scss'],
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
     * @param {ActivatedRoute} route
     * @memberof CreatePolicyPage
     */
    constructor(private policyApi: PolicyAPIService, private route: ActivatedRoute) {
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
        this.route.params.subscribe(params => { this._companyGUID = params.id; });
        this.policyApi.get_general_leave_policy_id(this._companyGUID).subscribe(list => {
            this.policyList = list;
            this.editPolicyDetails();
        })
        this.policyApi.get_company_list().subscribe(data => {
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
        this.editDetails();
    }


    /**
     * get the details from Id of company GUID
     * @memberof CreatePolicyPage
     */
    editDetails() {
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
        }
        this.monthYEChanged(model, year);
    }

    /**
     * Get total number of days in a month if selection month is changed
     * @param {string} model
     * @param {number} [year]
     * @memberof CreatePolicyPage
     */
    monthYEChanged(model: string, year?: number) {
        if (model == 'monthYE') {
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
     * enable/disable mat form field of carry forward selection
     * @param {*} val
     * @memberof CreatePolicyPage
     */
    checkEventCF(val: any) {
        if (val.detail.checked) {
            this.policyForm.controls.CFMonth.enable();
            this.policyForm.controls.CFDay.enable();
        } else {
            this.policyForm.controls.CFMonth.disable();
            this.policyForm.controls.CFDay.disable();
        }
    }


    /**
     * enable/disable mat form field of year end closing selection
     * @param {*} event
     * @memberof CreatePolicyPage
     */
    checkEventYr(event: any) {
        if (event.detail.checked) {
            this.policyForm.controls.YEMonth.enable();
            this.policyForm.controls.YEDay.enable();
            this.policyForm.controls.YEChoice.enable();
        } else {
            this.policyForm.controls.YEMonth.disable();
            this.policyForm.controls.YEDay.disable();
            this.policyForm.controls.YEChoice.disable();
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
        this.saveValue();
    }

    /**
     * data that created to POST to backend API
     * @memberof CreatePolicyPage
     */
    saveValue() {
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
            this.policyApi.message('saved successfully');
            this.showSmallSpinner = false;
        })
    }

}