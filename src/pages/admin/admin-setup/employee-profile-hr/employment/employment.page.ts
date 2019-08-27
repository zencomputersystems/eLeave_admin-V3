import { Component, OnInit, Input } from '@angular/core';
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
   * input value from employee-profile (requested userId details)
   * @type {*}
   * @memberof EmploymentPage
   */
    @Input() public employmentList: any;

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
     *Creates an instance of EmploymentPage.
     * @param {APIService} apiService
     * @memberof EmploymentPage
     */
    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.dateJoin = new FormControl((this.employmentList.employmentDetail.dateOfJoin), Validators.required);
        this.employmentList.employmentDetail.dateOfJoin = moment(this.employmentList.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
        this.dateConfirm = new FormControl((this.employmentList.employmentDetail.dateOfConfirmation), Validators.required);
        this.employmentList.employmentDetail.dateOfConfirmation = moment(this.employmentList.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
        this.dateResign = new FormControl((this.employmentList.employmentDetail.dateOfResign), Validators.required);
        this.employmentList.employmentDetail.dateOfResign = moment(this.employmentList.employmentDetail.dateOfResign).format('DD-MM-YYYY');
        this.status = this.employmentList.employmentDetail.employmentStatus;
    }

    /**
     * Update employment details to API
     * @memberof EmploymentPage
     */
    patchEmploymentData() {
        this.edit = false;
        const data = {
            "id": this.employmentList.id,
            "employeeNumber": this.employmentList.employmentDetail.employeeNumber,
            "designation": this.employmentList.employeeDesignation,
            "department": this.employmentList.employeeDepartment,
            "branch": '', // this.branch,
            "division": "",
            "workLocation": this.employmentList.employmentDetail.workLocation,  //nt able to patch this data
            "reportingTo": this.employmentList.employmentDetail.reportingTo,
            "employmentType": this.employmentList.employmentDetail.employmentType,
            "employmentStatus": employeeStatus[this.status],
            "dateOfJoin": moment(this.dateJoin.value).format('YYYY-MM-DD'),
            "dateOfConfirmation": moment(this.dateConfirm.value).format('YYYY-MM-DD'),
            "dateOfResign": moment(this.dateResign.value).format('YYYY-MM-DD'),
            "bankAccountName": this.employmentList.employmentDetail.bankAccountName,
            "bankAccountNumber": this.employmentList.employmentDetail.bankAccountNumber,
            "epfNumber": this.employmentList.employmentDetail.epfNumber,
            "incomeTaxNumber": this.employmentList.employmentDetail.incomeTaxNumber,
        };
        this.patchData(data);

    }

    /**
     * patch employement details to endpoint
     * @param {*} data
     * @memberof EmploymentPage
     */
    patchData(data: any) {
        this.apiService.patch_employment_details(data).subscribe((val) => {
            const userId = this.employmentList.userId;
            this.apiService.get_user_profile_details(userId).subscribe(
                (data: any[]) => {
                    this.employmentList = data;
                }
            );
        });
    }


}
