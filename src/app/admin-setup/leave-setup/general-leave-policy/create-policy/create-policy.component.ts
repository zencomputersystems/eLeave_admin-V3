import { Component, Input, SimpleChanges } from "@angular/core";
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
    // public showSpinner: boolean = true;

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
     * email toggle button value
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    public emailValue: string = 'No';

    /**
     * edit mode on/off
     * @type {string}
     * @memberof CreatePolicyComponent
     */
    public modeInput: string;

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
            } else {
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
                // this.showSpinner = false;
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
            this.editDetails();
        } else {
            this.emailValue = 'No';
            this._policyGUID = '';
        }
    }

    /**
     * get the details from Id of company GUID
     * @memberof CreatePolicyComponent
     */
    editDetails() {
        if (this.policyList.PROPERTIES_XML.emailReminder == true) {
            this.emailValue = 'Yes';
        } else {
            this.emailValue = 'No';
        }
        this.yearChanged(this.policyList.PROPERTIES_XML.allowYearEndClosing.relativeYear);
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
        if (year == undefined || this.policyList.PROPERTIES_XML.allowYearEndClosing.relativeYear == 'Next year') { year = 0 } else { year = 1 }
        if (model == 'monthCF') {
            const monthCF = this._monthArray.indexOf(this.policyList.PROPERTIES_XML.forfeitCFLeave.month) + 1;
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
            const monthYE = this._monthArray.indexOf(this.policyList.PROPERTIES_XML.allowYearEndClosing.month) + 1;
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
     * Update the policy details and PATCH to endpoint
     * @memberof CreatePolicyComponent
     */
    async savePolicy(changes) {
        if (changes.mode.previousValue === 'ON' && changes.mode.currentValue === 'OFF') {
            if (this._policyGUID != '') {
                const data = {
                    'generalPolicyId': this._policyGUID,
                    'data': this.policyList.PROPERTIES_XML
                }
                try {
                    await this.policyApi.patch_general_leave_policy(data).toPromise();
                    this.policyApi.message('Edit mode disabled. Good job!', true);
                }
                catch (err) {
                    this.policyApi.message(err.statusText, false);
                }
                this._policyGUID = '';
            } else {
                this.policyList.PROPERTIES_XML["tenantCompanyId"] = this.tenantId;
                try { await this.policyApi.post_general_leave_policy(this.policyList.PROPERTIES_XML).toPromise(); }
                catch (error) {
                    this.policyApi.message(error.statusText, false);
                }
                this.tenantId = '';
                this.policyApi.message('Edit mode disabled. Good job!', true);
            }
        }
    }

}