import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Leave header with router-outlet page 
 * @export
 * @class LeaveSetupComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-setup',
    templateUrl: './leave-setup.component.html',
    styleUrls: ['./leave-setup.component.scss'],
})
export class LeaveSetupComponent implements OnInit {

    /**
     * index of the link
     * @type {number}
     * @memberof LeaveSetupComponent
     */
    public numOfArray: number;

    /**
     *  url route
     * @type {string}
     * @memberof LeaveSetupComponent
     */
    public url: string;

    /**
     * link of the leave setup
     * @memberof LeaveSetupComponent
     */
    public leaveSetupPage = [
        {
            title: 'Calendar Profile Setup',
            url: ['/main/leave-setup/calendar-profile-setup'],
        },
        {
            title: 'Working Hour Setup',
            url: ['/main/leave-setup/working-hour-setup'],
        },
        {
            title: 'Leave Entitlement Setup',
            url: ['/main/leave-setup/leave-entitlement-setup'],
        },
        {
            title: 'Leave Adjustment',
            url: ['/main/leave-setup/leave-adjustment'],
        },
        {
            title: 'Leave Entitlement by Batch',
            url: ['/main/leave-setup/leave-entitlement-by-batch'],
        },
        {
            title: 'General Leave Policy',
            url: ['/main/leave-setup/general-leave-policy'],
        }
    ];

    /**
     *Creates an instance of LeaveSetupComponent.
     * @param {Router} router
     * @memberof LeaveSetupComponent
     */
    constructor(private router: Router) {
    }

    /**
     * initial method to check url
     * @memberof LeaveSetupComponent
     */
    ngOnInit() {
        this.checkUrl(this.router.url);
    }

    /**
     * check url of clicked link
     * @param {string} url
     * @memberof LeaveSetupComponent
     */
    checkUrl(url: string) {
        for (let i = 0; i < this.leaveSetupPage.length; i++) {
            if (this.leaveSetupPage[i].url.includes(url)) {
                this.getIndexToShowArrow(i);
            }
        }
    }

    /**
     * route to clicked link
     * @param {number} index
     * @memberof LeaveSetupComponent
     */
    getIndexToShowArrow(index: number) {
        this.numOfArray = index;
        this.router.navigate(this.leaveSetupPage[index].url);
    }

}