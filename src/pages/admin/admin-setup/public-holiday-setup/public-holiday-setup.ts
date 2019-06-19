import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Leave Planning Page
 * @export
 * @class LeavePlanningPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-public-holiday-setup',
    templateUrl: './public-holiday-setup.html',
    styleUrls: ['./public-holiday-setup.scss'],
})
export class PublicHolidaySetup implements OnInit {

    /**
     * This local property is used to get personal details from API
     * @type {*}
     * @memberof LeavePlanningPage
     */
    public list: any;

    /**
     * This local property is used to show or hide spinner
     * @type {boolean}
     * @memberof LeavePlanningPage
     */
    public showSpinner: boolean = true;

    /**
     * This local property is used to set subscription
     * @private
     * @type {Subscription}
     * @memberof LeavePlanningPage
     */
    private subscription: Subscription = new Subscription();

    /**
     * Return API content
     * @readonly
     * @memberof LeavePlanningPage
     */
    get personalList() {
        return this.list;
    }

    /**
     *Creates an instance of LeavePlanningPage.
     * @param {APIService} apiService
     * @param {Router} router
     * @memberof LeavePlanningPage
     */
    constructor(private apiService: APIService, private router: Router
    ) { }

    /**
     * Initial method
     * Get personal details from API
     * @memberof LeavePlanningPage
     */
    ngOnInit() {
        this.subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    /**
     * This method is used to destroy subscription
     * @memberof LeavePlanningPage
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * This method is used to route to the personal leave entitlement page
     * @memberof LeavePlanningPage
     */
    backToProfile() {
        this.router.navigate(['/main/employee-setup/leave-entitlement']);
    }
}