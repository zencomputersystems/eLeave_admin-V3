import { OnInit, Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PolicyAPIService } from "../policy-api.service";
import { LeaveAPIService } from "../../leave-setup/leave-api.service";

@Component({
    selector: 'app-create-policy',
    templateUrl: './create-policy.page.html',
    styleUrls: ['./create-policy.page.scss'],
})
export class CreatePolicyPage implements OnInit {

    public list: any;
    public showSpinner: boolean = true;
    public radioValue: any;
    public showEscalateDay: boolean = false;
    public daysOfCF: number[];
    public daysOfYE: number[];
    public CF: any;
    public yearEnd: any;
    public onBehalf: any;
    public email: any;
    public policyForm: any;
    public showSmallSpinner: boolean = false;
    private monthArray = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
    private nextYear = new Date().getFullYear() + 1;
    private data: any = {};

    constructor(private policyApi: PolicyAPIService, private leaveAPi: LeaveAPIService) {
        this.policyForm = new FormGroup(
            {
                company: new FormControl(null, Validators.required),
                level: new FormControl(null, Validators.required),
                escalateAfterDays: new FormControl(null, Validators.required),
                CFMonth: new FormControl({ value: null, disabled: true }, Validators.required),
                CFDay: new FormControl({ value: null, disabled: true }, Validators.required),
                YEMonth: new FormControl({ value: null, disabled: true }, Validators.required),
                YEDay: new FormControl({ value: null, disabled: true }, Validators.required),
                YEChoice: new FormControl({ value: 'Next year', disabled: true }, Validators.required)
            });
    }

    ngOnInit() {
        this.showSpinner = false;
        this.leaveAPi.get_compant_list().subscribe(data => this.list = data)
    }

    getTotalDays(month, year) {
        return new Date(year, month, 0).getDate();
    };

    monthChanged(model: string, year?: number) {
        if (year == undefined || this.policyForm.controls.YEChoice.value == 'Next year') { year = 0 } else { year = 1 }
        if (model == 'monthCF') {
            const monthCF = this.monthArray.indexOf(this.policyForm.controls.CFMonth.value) + 1;
            let dayCF = this.getTotalDays(monthCF, this.nextYear);
            this.daysOfCF = [];
            for (let i = 1; i < dayCF + 1; i++) {
                this.daysOfCF.push(i);
            }
        } else {
            const monthYE = this.monthArray.indexOf(this.policyForm.controls.YEMonth.value) + 1;
            let dayYE = this.getTotalDays(monthYE, this.nextYear - year);
            this.daysOfYE = [];
            for (let i = 1; i < dayYE + 1; i++) {
                this.daysOfYE.push(i);
            }
        }
    }

    yearChanged(event) {
        if (event.value == 'This year') {
            this.monthChanged('monthYE', 1);
        } else {
            this.monthChanged('monthYE', 0);
        }
    }

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

    radioEvent(event) {
        this.radioValue = event.value;
        console.log(this.radioValue);
        if (this.radioValue == 'Superior') {
            this.policyForm.controls.patchValue({ level: null })
        }
    }

    value(value) {
        console.log(value);
    }

    createPolicy() {
        this.data.approvalConfirmation = {};
        this.data.approvalConfirmation.requirement = this.radioValue;
        this.data.approvalConfirmation.approvalLevel = Number(this.policyForm.controls.level.value);
        this.data.approvalConfirmation.escalateAfterDays = this.policyForm.controls.escalateAfterDays.value;
        this.data.forfeitCFLeave = {};
        this.data.forfeitCFLeave.value = this.CF;
        this.data.forfeitCFLeave.day = this.policyForm.controls.CFDay.value;
        this.data.forfeitCFLeave.month = this.policyForm.controls.CFMonth.value;
        this.data.allowYearEndClosing = {};
        this.data.allowYearEndClosing.value = this.yearEnd;
        this.data.allowYearEndClosing.day = this.policyForm.controls.YEDay.value;
        this.data.allowYearEndClosing.month = this.policyForm.controls.YEMonth.value;
        this.data.allowYearEndClosing.relativeYear = this.policyForm.controls.YEChoice.value;
        this.data.applyOnBehalfConfirmation = this.onBehalf;
        this.data.emailReminder = this.email;
        this.data.tenantCompanyId = this.policyForm.controls.company.value;
        console.log(this.data);
        this.policyApi.post_general_leave_policy(this.data).subscribe(success => {
            console.log(success);
            this.showSmallSpinner = false;
        });
    }
}