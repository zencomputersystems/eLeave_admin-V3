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

    public numOfArray: number;
    public url: string;
    public lastSegment: string;
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
        }
    ];

    /**
     *Creates an instance of LeaveSetupComponent.
     * @memberof LeaveSetupComponent
     */
    constructor(private router: Router) {
    }

    ngOnInit() {
        this.checkUrl(this.router.url);
    }

    checkUrl(url: string) {
        for (let i = 0; i < this.leaveSetupPage.length; i++) {
            if (this.leaveSetupPage[i].url.includes(url)) {
                this.getIndexToShowArrow(i);
            }
        }
    }

    getIndexToShowArrow(index: number) {
        this.numOfArray = index;
        this.router.navigate(this.leaveSetupPage[index].url);
    }

}