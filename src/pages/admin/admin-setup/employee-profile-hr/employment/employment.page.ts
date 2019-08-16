import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { employeeStatus } from '../employee-profile.service';
const moment = _moment;

/**
 * Page of Employment Page
 * @export
 * @class EmploymentPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employment',
    templateUrl: './employment.page.html',
    styleUrls: ['./employment.page.scss'],
})
export class EmploymentPage implements OnInit {

    /**
     * Get personal details from API
     * @type {*}
     * @memberof EmploymentPage
     */
    public list: any;

    /**
     * Get employment details from API
     * @type {*}
     * @memberof EmploymentPage
     */
    public employmentlist: any;

    /**
     * Show edit form field or vice versa
     * @type {boolean}
     * @memberof EmploymentPage
     */
    public edit: boolean = false;

    /**
     * Get employment status from enum 
     * @type {*}
     * @memberof EmploymentPage
     */
    public status: any;

    /**
     * Tracks validity of date join
     * @type {FormGroup}
     * @memberof EmploymentPage
     */
    public dateJoin: any;

    /**
     * Tracks validity of date confirm
     * @type {FormGroup}
     * @memberof EmploymentPage
     */
    public dateConfirm: any;

    /**
     * Tracks validity of date resign
     * @type {FormGroup}
     * @memberof EmploymentPage
     */
    public dateResign: any;

    /**
     * Get company branch
     * @type {string}
     * @memberof EmploymentPage
     */
    public branch: string;

    /**
     * user list details from API
     * @type {*}
     * @memberof EmploymentPage
     */
    public data: any;

    /**
     * filtered reporting name from employee id
     * @type {string}
     * @memberof EmploymentPage
     */
    public reportingName: string;

    /**
     * Return value from personal details
     * @readonly
     * @memberof EmploymentPage
     */
    get personalList() {
        return this.list;
    }

    /**
     * Return value from employment details
     * @readonly
     * @memberof EmploymentPage
     */
    get employmentPersonalList() {
        return this.employmentlist;
    }

    /**
     *Creates an instance of EmploymentPage.
     * @param {APIService} apiService
     * @memberof EmploymentPage
     */
    constructor(private apiService: APIService) {

    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                const userId = this.list.id;
                this.getEmploymentDetailsById(userId);
            },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * get employment details from requested ID
     * @param {string} id
     * @memberof EmploymentPage
     */
    getEmploymentDetailsById(id: string) {
        this.apiService.get_employment_details(id).subscribe(
            data => {
                this.employmentlist = data;
                this.reporting();
                this.dateJoin = new FormControl((this.employmentlist.employmentDetail.dateOfJoin), Validators.required);
                this.employmentlist.employmentDetail.dateOfJoin = moment(this.employmentlist.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
                this.dateConfirm = new FormControl((this.employmentlist.employmentDetail.dateOfConfirmation), Validators.required);
                this.employmentlist.employmentDetail.dateOfConfirmation = moment(this.employmentlist.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
                this.dateResign = new FormControl((this.employmentlist.employmentDetail.dateOfResign), Validators.required);
                this.employmentlist.employmentDetail.dateOfResign = moment(this.employmentlist.employmentDetail.dateOfResign).format('DD-MM-YYYY');
                this.status = employeeStatus[this.employmentlist.employmentDetail.employmentStatus];
            })
    }

    /**
     * filter employee reporting superior name
     * @memberof EmploymentPage
     */
    reporting() {
        this.apiService.get_user_profile_list().subscribe(data => {
            this.data = data;
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].userId === this.employmentlist.employmentDetail.reportingTo) {
                    this.reportingName = this.data[i].employeeName;
                }
            }
        })
    }


    /**
     * Update employment details to API
     * @memberof EmploymentPage
     */
    patchEmploymentData() {
        this.edit = false;
        const data = {
            "id": this.list.id,
            "employeeNumber": this.employmentlist.employmentDetail.employeeNumber,
            "designation": this.employmentlist.employeeDesignation,
            "department": this.employmentlist.employeeDepartment,
            "branch": '', // this.branch,
            "division": "",
            "workLocation": this.employmentlist.employmentDetail.workLocation,  //nt able to patch this data
            "reportingTo": this.employmentlist.employmentDetail.reportingTo,
            "employmentType": this.employmentlist.employmentDetail.employmentType,
            "employmentStatus": employeeStatus[this.status],
            "dateOfJoin": moment(this.dateJoin.value).format('YYYY-MM-DD'),
            "dateOfConfirmation": moment(this.dateConfirm.value).format('YYYY-MM-DD'),
            "dateOfResign": moment(this.dateResign.value).format('YYYY-MM-DD'),
            "bankAccountName": this.employmentlist.employmentDetail.bankAccountName,
            "bankAccountNumber": this.employmentlist.employmentDetail.bankAccountNumber,
            "epfNumber": this.employmentlist.employmentDetail.epfNumber,
            "incomeTaxNumber": this.employmentlist.employmentDetail.incomeTaxNumber,
        };
        this.apiService.patch_employment_details(data).subscribe((val) => {
            const userId = this.list.id;
            this.getEmploymentDetailsById(userId);
        });
    }


}
