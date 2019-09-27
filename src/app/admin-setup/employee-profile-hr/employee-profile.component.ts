import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { employeeStatus } from './employee-profile.service';

/**
 * Employee Profile Page
 * @export
 * @class EmployeeProfileComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employee-profile',
    templateUrl: './employee-profile.component.html',
    styleUrls: ['./employee-profile.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class EmployeeProfileComponent implements OnInit {

    /**
     * Get personal details from API
     * @type {*}
     * @memberof EmployeeProfileComponent
     */
    public list: any;

    /**
     * Get user Id from API
     * @type {string}
     * @memberof EmployeeProfileComponent
     */
    public userId: string;

    /**
     * Show star icon highlight or vice versa
     * @type {boolean}
     * @memberof EmployeeProfileComponent
     */
    public numOfArray: boolean = false;

    /**
     * show spinner during load page
     * @type {boolean}
     * @memberof EmployeeProfileComponent
     */
    public showSpinner: boolean = false;

    /**
     *Creates an instance of EmployeeProfileComponent.
     * @param {APIService} apiService
     * @param {Router} router
     * @memberof EmployeeProfileComponent
     */
    constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) {
        route.queryParams
            .subscribe((params) => {
                this.userId = params.GUID;
                this.showSpinner = true;
                this.apiService.get_user_profile_details(this.userId).subscribe(
                    (data: any[]) => {
                        this.showSpinner = false;
                        this.list = data;
                        this.list.employmentDetail.employmentStatus = employeeStatus[this.list.employmentDetail.employmentStatus];
                    }
                );
            });
    }

    ngOnInit() {

    }

    /**
     * To change star icon color when clicked
     * @memberof EmployeeProfileComponent
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
     * @memberof EmployeeProfileComponent
     */
    toMyProfile() {
        this.router.navigate(['/main/employee-setup']);
    }

}
