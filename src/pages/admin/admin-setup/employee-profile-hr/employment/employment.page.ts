import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { employeeStatus, employeeType } from '../employee-profile.service';
import { Subscription } from 'rxjs';
const moment = _moment;

@Component({
    selector: 'app-employment',
    templateUrl: './employment.page.html',
    styleUrls: ['./employment.page.scss'],
})
export class EmploymentPage implements OnInit {

    public list: any;
    public employmentlist: any;
    public edit: boolean = false;
    public status: any;
    public dateJoinForm: FormGroup;
    public dateConfirmForm: FormGroup;
    public dateResignForm: FormGroup;
    public branch: string;
    private _subscription: Subscription = new Subscription();

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }

    constructor(private apiService: APIService, private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.dateJoinForm = this._formBuilder.group({
            dateJoin: ['', Validators.required]
        });
        this.dateConfirmForm = this._formBuilder.group({
            dateConfirm: ['', Validators.required]
        });
        this.dateResignForm = this._formBuilder.group({
            dateResign: ['', Validators.required]
        });
        this._subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
            },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            },
            () => {
                const userId = this.list.id;
                this._subscription = this.apiService.get_employment_details(userId).subscribe(
                    data => {
                        this.employmentlist = data;
                        this.data();
                    })
            });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    data() {
        this.dateJoinForm = new FormGroup({
            dateJoin: new FormControl(new Date(this.employmentlist.employmentDetail.dateOfJoin)),
        })
        this.dateConfirmForm = new FormGroup({
            dateConfirm: new FormControl(new Date(this.employmentlist.employmentDetail.dateOfConfirmation)),
        })
        this.dateResignForm = new FormGroup({
            dateResign: new FormControl(new Date(this.employmentlist.employmentDetail.dateOfResign)),
        })
        this.status = employeeStatus[this.employmentlist.employmentDetail.employmentStatus];
    }

    patchEmploymentData() {
        this.edit = false;
        const data = {
            "id": this.list.id,
            "employeeNumber": this.employmentlist.employmentDetail.employeeNumber,
            "designation": this.employmentlist.employeeDesignation,
            "department": this.employmentlist.employeeDepartment,
            "branch": this.branch,
            "division": "",
            "workLocation": this.employmentlist.employmentDetail.workLocation,  //nt able to patch this data
            "reportingTo": this.employmentlist.employmentDetail.reportingTo,
            "employmentType": this.employmentlist.employmentDetail.employmentType,
            "employmentStatus": employeeStatus[this.status],
            "dateOfJoin": moment(this.dateJoinForm.value.dateJoin).format('YYYY-MM-DD'),
            "dateOfConfirmation": moment(this.dateConfirmForm.value.dateConfirm).format('YYYY-MM-DD'),
            "dateOfResign": moment(this.dateResignForm.value.dateResign).format('YYYY-MM-DD'),
            "bankAccountName": this.employmentlist.employmentDetail.bankAccountName,
            "bankAccountNumber": this.employmentlist.employmentDetail.bankAccountNumber,
            "epfNumber": this.employmentlist.employmentDetail.epfNumber,
            "incomeTaxNumber": this.employmentlist.employmentDetail.incomeTaxNumber,
        };
        this._subscription = this.apiService.patch_employment_details(data).subscribe((val) => {
            console.log("PATCH call successful value returned in body", val);
        },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
                const userId = this.list.id;
                this._subscription = this.apiService.get_employment_details(userId).subscribe(
                    data => {
                        this.employmentlist = data;
                        console.log('get back', this.employmentlist);
                    })
            });
    }


}
