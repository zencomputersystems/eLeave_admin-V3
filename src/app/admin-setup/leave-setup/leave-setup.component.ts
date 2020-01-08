import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { EditModeDialogComponent } from './edit-mode-dialog/edit-mode-dialog.component';
import { MatDialog } from '@angular/material';
import { RouteDialogComponent } from './route-dialog/route-dialog.component';

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
     * toggle mode on off value
     * @type {string}
     * @memberof LeaveSetupComponent
     */
    public emittedValue: string;

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
    constructor(private router: Router, private _sharedService: SharedService, public dialog: MatDialog) {
        router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.checkUrl(e.urlAfterRedirects);
            });

        _sharedService.changeEmitted$.subscribe(
            text => {
                this.emittedValue = text;
            });
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
                this.showHighlightMenu(i);
            }
        }
    }

    /**
     * route to clicked link
     * @param {number} index
     * @memberof LeaveSetupComponent
     */
    showHighlightMenu(index: number) {
        if (this.emittedValue == 'OFF' || this.emittedValue == null) {
            this.numOfArray = index;
            this.router.navigate(this.leaveSetupPage[index].url);
        } else {
            this.dialog.open(RouteDialogComponent, {
                width: "283px",
                height: "194px"
            });
        }
    }

}