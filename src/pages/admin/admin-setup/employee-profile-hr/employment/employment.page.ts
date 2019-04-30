import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { employeeStatus, employeeType } from '../employee-profile.service';
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
    public numID: string;
    public designation: string;
    public department: string;
    public workLocation: string;
    public reportingTo: string;
    public type: any;
    public status: any;
    public dateJoinForm: FormGroup;
    public dateConfirmForm: FormGroup;
    public dateResignForm: FormGroup;
    public yearService: string;
    public accName: string;
    public accNum: string;
    public epf: string;
    public incomeTax: string;
    public branch: string;
    private _dateJoin;
    private _dateConfirm;
    private _dateResign;

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
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            },
            () => {
                const userId = this.list.id;
                this.apiService.get_employment_details(userId).subscribe(
                    data => {
                        this.employmentlist = data;
                        console.log('employ', this.employmentlist);
                        this.numID = this.employmentlist.employmentDetail.employeeNumber;
                        this.designation = this.employmentlist.employeeDesignation;
                        this.dateJoinForm = new FormGroup({
                            dateJoin: new FormControl(new Date(this.employmentlist.employmentDetail.dateOfJoin)),
                        })
                        this.dateConfirmForm = new FormGroup({
                            dateConfirm: new FormControl(new Date(this.employmentlist.employmentDetail.dateOfConfirmation)),
                        })
                        this.dateResignForm = new FormGroup({
                            dateResign: new FormControl(new Date(this.employmentlist.employmentDetail.dateOfResign)),
                        })
                        this._dateJoin = moment(this.dateJoinForm.value.dateJoin).format('YYYY-MM-DD');
                        this._dateConfirm = moment(this.dateConfirmForm.value.dateConfirm).format('YYYY-MM-DD');
                        this._dateResign = moment(this.dateResignForm.value.dateResign).format('YYYY-MM-DD');
                        this.department = this.employmentlist.employeeDepartment;
                        this.workLocation = this.employmentlist.employmentDetail.workLocation;
                        this.reportingTo = this.employmentlist.employmentDetail.reportingTo;
                        this.type = this.employmentlist.employmentDetail.employmentType;
                        this.status = employeeStatus[this.employmentlist.employmentDetail.employmentStatus];
                        this.yearService = this.employmentlist.employmentDetail.yearOfService;
                        this.accName = this.employmentlist.employmentDetail.bankAccountName;
                        this.accNum = this.employmentlist.employmentDetail.bankAccountNumber;
                        this.epf = this.employmentlist.employmentDetail.epfNumber;
                        this.incomeTax = this.employmentlist.employmentDetail.incomeTaxNumber;
                    }
                )
            }
        );
    }

    dateChange() {
        if (this.dateJoinForm.value.dateJoin || this.dateJoinForm.status === 'VALID') {
            this._dateJoin = moment(this.dateJoinForm.value.dateJoin).format('YYYY-MM-DD');
        }
        if (this.dateConfirmForm.value.dateConfirm || this.dateConfirmForm.status === 'VALID') {
            this._dateConfirm = moment(this.dateConfirmForm.value.dateConfirm).format('YYYY-MM-DD');
        }
        if (this.dateResignForm.value.dateResign || this.dateResignForm.status === 'VALID') {
            this._dateResign = moment(this.dateResignForm.value.dateResign).format('YYYY-MM-DD');
        }
    }
    statusChanged(event) {
        this.status = event.value;
        console.log('status', this.status);
    }
    typeChanged(event) {
        this.type = event.value;
    }
    patchEmploymentData() {
        this.edit = false;
        const data = {
            "id": this.list.id,
            "employeeNumber": this.numID,
            "designation": this.designation,
            "department": this.department,
            "branch": "Cyberjaya",
            "division": "",
            "workLocation": this.workLocation,  //nt able to patch this data
            "reportingTo": this.reportingTo,
            "employmentType": this.type,
            "employmentStatus": employeeStatus[this.status],
            "dateOfJoin": this._dateJoin,
            "dateOfConfirmation": this._dateConfirm,
            "dateOfResign": this._dateResign,
            "bankAccountName": this.accName,
            "bankAccountNumber": this.accNum,
            "epfNumber": this.epf,
            "incomeTaxNumber": this.incomeTax,
        };
        this.apiService.patch_employment_details(data).subscribe((val) => {
            console.log("PATCH call successful value returned in body", val);
        },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
                const userId = this.list.id;
                this.apiService.get_employment_details(userId).subscribe(
                    data => {
                        this.employmentlist = data;
                        console.log('get back', this.employmentlist);
                    })
            });
    }


}
