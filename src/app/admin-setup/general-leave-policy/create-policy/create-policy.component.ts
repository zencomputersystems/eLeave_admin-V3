import { Component, Input, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PolicyApiService } from "../policy-api.service";

/**
 * create new general leave policy & edit policy page
 * @export
 * @class CreatePolicyComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-create-policy',
    templateUrl: './create-policy.component.html',
    styleUrls: ['./create-policy.component.scss'],
})
export class CreatePolicyComponent {

    /**
     * company id input
     * @type {*}
     * @memberof CreatePolicyComponent
     */
    @Input() companyId: any;

    /**
     * mode on/off 
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    @Input() mode: string;

    /**
     * tenant company guid
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    @Input() tenantId: string;

    /**
     * company list from API
     * @type {*}
     * @memberof CreatePolicyComponent
     */
    public list: any;

    /**
     * All tenant policy list and details
     * @type {*}
     * @memberof CreatePolicyComponent
     */
    public policyList: any;

    /**
     * show spinner during loading page
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public showSpinner: boolean = true;

    /**
     * hide container during loading page
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    // public showContainer: boolean = false;

    /**
     * mat radio button value 
     * @type {*}
     * @memberof CreatePolicyComponent
     */
    public radioValue: any;

    /**
     * number of escalation day 
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public showEscalateDay: boolean = false;

    /**
     * array list of days in a selected month in carried forward field
     * eg: 1 to 30
     * @type {number[]}
     * @memberof CreatePolicyComponent
     */
    public daysOfCF: number[];

    /**
     * array list of days in a selected month in year end closing field
     * eg: 1 to 30
     * @type {number[]}
     * @memberof CreatePolicyComponent
     */
    public daysOfYE: number[];

    /**
     * carried forward checkbox value
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public CF: boolean = false;

    /**
     * year end closing checkbox value
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public yearEnd: boolean = false;

    /**
     * apply on behalf checkbox value
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public onBehalf: boolean = false;

    /**
     * email checkbox value
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public email: boolean = false;

    /**
     * validation form value
     * @type {*}
     * @memberof CreatePolicyComponent
     */
    public policyForm: any;

    /**
     * email toggle button value
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    public emailValue: string = 'No';

    /**
     * email toggle button check/uncheck
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    public emailCheck: boolean = false;

    /**
     * edit mode on/off
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    public modeInput: string;

    /**
     * show loading spinner when clicked on create policy to API
     * @type {boolean}
     * @memberof CreatePolicyComponent
     */
    // public showSmallSpinner: boolean = false;

    /**
     * to get index of selected month 
     * @private
     * @memberof CreatePolicyComponent
     */
    private _monthArray = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

    /**
     * next year number
     * eg: 2020
     * @private
     * @memberof CreatePolicyComponent
     */
    private _nextYear = new Date().getFullYear() + 1;

    /**
     * empty object 
     * @private
     * @type {*}
     * @memberof CreatePolicyComponent
     */
    private _data: any = {};

    /**
     * Selected policy GUID (to patch to endpoint)
     * @private
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    private _policyGUID: string;

    /**
     *Creates an instance of CreatePolicyComponent.
     * @param {PolicyApiService} policyApi
     * @memberof CreatePolicyComponent
     */
    constructor(private policyApi: PolicyApiService) {
        this.policyForm = new FormGroup(
            {
                anyoneLevel: new FormControl({ value: null, disabled: true }, Validators.required),
                everyoneLevel: new FormControl({ value: null, disabled: true }, Validators.required),
                escalateAfterDays: new FormControl({ value: null, disabled: true }, Validators.required),
                CF: new FormControl({ value: null, disabled: true }, Validators.required),
                CFMonth: new FormControl({ value: null, disabled: true }, Validators.required),
                CFDay: new FormControl({ value: null, disabled: true }, Validators.required),
                yearEnd: new FormControl({ value: null, disabled: true }, Validators.required),
                YEMonth: new FormControl({ value: null, disabled: true }, Validators.required),
                YEDay: new FormControl({ value: null, disabled: true }, Validators.required),
                YEChoice: new FormControl({ value: 'Next year', disabled: true }, Validators.required),
                onBehalf: new FormControl({ value: null, disabled: true }, Validators.required),
                email: new FormControl({ value: null, disabled: true }, Validators.required)
            });
    }

    /**
     * mode input changes
     * @param {SimpleChanges} changes
     * @memberof CreatePolicyComponent
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.mode != undefined) {
            this.modeInput = changes.mode.currentValue;
            if (this.modeInput === 'ON') {
                this.policyForm.enable();
                this.policyForm.controls.CFMonth.enable();
                this.policyForm.controls.CFDay.enable();
                this.policyForm.controls.YEMonth.enable();
                this.policyForm.controls.YEDay.enable();
                this.policyForm.controls.YEChoice.enable();
            } else {
                this.policyForm.disable();
                this.savePolicy(changes);
            }
        }
        this.detectChanges(changes);
    }

    /**
     * company input changes
     * @param {*} changes
     * @memberof CreatePolicyComponent
     */
    detectChanges(changes) {
        if (changes.companyId != undefined) {
            if (changes.companyId.currentValue != undefined) {
                this.companyDetailsChanges(changes);
                this.showSpinner = false;
            }
        }
    }

    /**
     * company details changes
     * @param {*} changes
     * @memberof CreatePolicyComponent
     */
    companyDetailsChanges(changes) {
        if (changes.companyId.currentValue.MAIN_GENERAL_POLICY_GUID != undefined) {
            this.policyList = changes.companyId.currentValue;
            this._policyGUID = this.policyList.MAIN_GENERAL_POLICY_GUID;
            this.radioValue = this.policyList.PROPERTIES_XML.approvalConfirmation.requirement;
            if (this.radioValue == 'Anyone') {
                this.policyForm.patchValue({ anyoneLevel: this.policyList.PROPERTIES_XML.approvalConfirmation.approvalLevel });
            } else {
                this.policyForm.patchValue({ everyoneLevel: this.policyList.PROPERTIES_XML.approvalConfirmation.approvalLevel });
            }
            this.policyForm.controls.escalateAfterDays.value = this.policyList.PROPERTIES_XML.approvalConfirmation.escalateAfterDays;
            this.policyForm.patchValue({ CF: this.policyList.PROPERTIES_XML.forfeitCFLeave.value });
            this.policyForm.patchValue({ CFMonth: this.policyList.PROPERTIES_XML.forfeitCFLeave.month });
            this.policyForm.controls.CFDay.value = this.policyList.PROPERTIES_XML.forfeitCFLeave.day;
            this.editDetails();
        } else {
            this.policyForm.reset();
            this.radioValue = null;
            this.emailValue = 'No';
        }
    }

    /**
     * get the details from Id of company GUID
     * @memberof CreatePolicyComponent
     */
    editDetails() {
        this.policyForm.patchValue({ yearEnd: this.policyList.PROPERTIES_XML.allowYearEndClosing.value });
        this.policyForm.patchValue({ YEMonth: this.policyList.PROPERTIES_XML.allowYearEndClosing.month });
        this.policyForm.patchValue({ YEDay: this.policyList.PROPERTIES_XML.allowYearEndClosing.day });
        this.policyForm.patchValue({ YEChoice: this.policyList.PROPERTIES_XML.allowYearEndClosing.relativeYear });
        this.policyForm.patchValue({ onBehalf: this.policyList.PROPERTIES_XML.applyOnBehalfConfirmation });
        this.policyForm.patchValue({ email: this.policyList.PROPERTIES_XML.emailReminder });
        if (this.policyForm.controls.email.value == true) {
            this.emailValue = 'Yes';
            this.emailCheck = true;
        } else {
            this.emailValue = 'No';
            this.emailCheck = false;
        }
        this.yearChanged(this.policyForm.controls.YEChoice.value);
        this.monthChanged('monthCF', 0);
    }

    /**
     * Get total number of day in a selected month and year
     * @param {*} month
     * @param {*} year
     * @returns
     * @memberof CreatePolicyComponent
     */
    getTotalDays(month, year) {
        return new Date(year, month, 0).getDate();
    };

    /**
     * Get total number of days in a month if selection month is changed
     * @param {string} model
     * @param {number} [year]
     * @memberof CreatePolicyComponent
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
     * @memberof CreatePolicyComponent
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
     * @memberof CreatePolicyComponent
     */
    yearChanged(value) {
        if (value == 'This year') {
            this.monthChanged('monthYE', 1);
        } else {
            this.monthChanged('monthYE', 0);
        }
    }

    /**
     * data that created to POST to backend API
     * @memberof CreatePolicyComponent
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
        this._data.forfeitCFLeave.value = this.policyForm.controls.CF.value;
        this._data.forfeitCFLeave.day = this.policyForm.controls.CFDay.value;
        this._data.forfeitCFLeave.month = this.policyForm.controls.CFMonth.value;
        this.saveValue();
    }

    /**
     * data that created to POST to backend API
     * @memberof CreatePolicyComponent
     */
    saveValue() {
        this._data.allowYearEndClosing = {};
        this._data.allowYearEndClosing.value = this.policyForm.controls.yearEnd.value;
        this._data.allowYearEndClosing.day = this.policyForm.controls.YEDay.value;
        this._data.allowYearEndClosing.month = this.policyForm.controls.YEMonth.value;
        this._data.allowYearEndClosing.relativeYear = this.policyForm.controls.YEChoice.value;
        this._data.applyOnBehalfConfirmation = this.policyForm.controls.onBehalf.value;
        this._data.emailReminder = this.policyForm.controls.email.value;
    }

    /**
     * Update the policy details and PATCH to endpoint
     * @memberof CreatePolicyComponent
     */
    async savePolicy(changes) {
        if (changes.mode.previousValue === 'ON' && changes.mode.currentValue === 'OFF') {
            this.getValue();
            if (this._policyGUID != undefined) {
                const data = {
                    'generalPolicyId': this._policyGUID,
                    'data': this._data
                }
                await this.policyApi.patch_general_leave_policy(data).toPromise();
                this.policyApi.message('Edit mode disabled. Good job!', true);
                this._policyGUID = '';
            } else {
                this._data["tenantCompanyId"] = this.tenantId;
                await this.policyApi.post_general_leave_policy(this._data).toPromise();
                this.tenantId = '';
                this.policyApi.message('Edit mode disabled. Good job!', true);
            }
        }
    }

}