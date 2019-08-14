import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { employeeStatus } from './employee-profile.service';
/**
 * Employee Profile Page
 * @export
 * @class EmployeeProfilePage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employee-profile',
    templateUrl: './employee-profile.page.html',
    styleUrls: ['./employee-profile.page.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class EmployeeProfilePage implements OnInit {

    /**
     * Get personal details from API
     * @type {*}
     * @memberof EmployeeProfilePage
     */
    public list: any;

    /**
     * Get user Id from API
     * @type {string}
     * @memberof EmployeeProfilePage
     */
    public userId: string;

    /**
     * Get Employment details from API
     * @type {*}
     * @memberof EmployeeProfilePage
     */
    public employmentlist: any;

    /**
     * Show star icon highlight or vice versa
     * @type {boolean}
     * @memberof EmployeeProfilePage
     */
    public numOfArray: boolean = false;

    /**
     * Return personal details content
     * @readonly
     * @memberof EmployeeProfilePage
     */
    get personalList() {
        return this.list;
    }

    /**
     * Return employment details content
     * @readonly
     * @memberof EmployeeProfilePage
     */
    get employmentPersonalList() {
        return this.employmentlist;
    }

    /**
     *Creates an instance of EmployeeProfilePage.
     * @param {APIService} apiService
     * @param {Router} router
     * @memberof EmployeeProfilePage
     */
    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.userId = this.list.id;
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
                        this.employmentlist.employmentDetail.employmentStatus = employeeStatus[this.employmentlist.employmentDetail.employmentStatus]
                    }
                )
            }
        );
    }

    /**
     * To change star icon color when clicked
     * @memberof EmployeeProfilePage
     */
    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else {
            this.numOfArray = true;
        }
    };

    /**
     * Route to personal details page
     * @memberof EmployeeProfilePage
     */
    toMyProfile() {
        this.router.navigate(['/main/employee-setup']);
    }

}
