import { OnInit, Component } from "@angular/core";

@Component({
    selector: 'app-create-policy',
    templateUrl: './create-policy.page.html',
    styleUrls: ['./create-policy.page.scss'],
})
export class CreatePolicyPage implements OnInit {

    public showSpinner: boolean = true;
    public daysOfCF: number[];
    public daysOfYE: number[];
    public monthCF: string;
    public dayCF: number;
    public monthYE: string;
    public dayYE: number;
    public yearChoice: string = "Next year";
    private monthArray = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
    private nextYear = new Date().getFullYear() + 1;

    constructor() { }

    ngOnInit() {
        this.showSpinner = false;
    }

    getTotalDays(month, year) {
        return new Date(year, month, 0).getDate();
    };

    monthCFChanged(model: string, year?: number) {
        if (year == undefined && this.yearChoice == 'Next year') { year = 0 } else { year = 1 }
        if (model == 'monthCF') {
            const monthCF = this.monthArray.indexOf(this.monthCF) + 1;
            let dayCF = this.getTotalDays(monthCF, this.nextYear);
            this.daysOfCF = [];
            for (let i = 1; i < dayCF + 1; i++) {
                this.daysOfCF.push(i);
            }
        } else {
            const monthYE = this.monthArray.indexOf(this.monthYE) + 1;
            let dayYE = this.getTotalDays(monthYE, this.nextYear - year);
            this.daysOfYE = [];
            for (let i = 1; i < dayYE + 1; i++) {
                this.daysOfYE.push(i);
            }
        }
    }

    yearChanged(event) {
        if (event.value == 'This year') {
            this.monthCFChanged('monthYE', 1);
        } else {
            this.monthCFChanged('monthYE', 0);
        }
    }
}