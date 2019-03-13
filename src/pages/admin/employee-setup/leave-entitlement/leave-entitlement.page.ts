import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-leave-entitlement',
    templateUrl: './leave-entitlement.page.html',
    styleUrls: ['./leave-entitlement.page.scss'],
})
export class LeaveEntitlementPage implements OnInit {

    public leaves: any;
    public personalDataList: any = '';
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public arrowDown: boolean = true;
    private leaveTypeValue: any;

    public get sortDirectionArrowDown(): boolean {
        return this.arrowDown;
    }

    public get leaveData() {
        return this.leaveTypeValue;
    }

    public get personalList() {
        return this.personalDataList;
    }
    constructor(private apiService: APIService
    ) { }

    ngOnInit() {
        this.apiService.get_user_profile_me().subscribe(
            response => this.personalDataList = response.json()
        );
    }

    clickToHideHeader() {
        this.showHeader = false;
    }


    sortAscLeaveType() {
        this.arrowDown = true;
        this.leaveTypeValue = this.leaves.source.value.slice(0);
        this.leaveTypeValue.sort(function (a, b) {
            var x = a.leave_type.toLowerCase();
            var y = b.leave_type.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

        console.log('byTypeASc', this.leaveTypeValue);
        // need to update the sorted list in html

    }

    sortDesLeaveType() {
        this.arrowDown = false;
        this.leaveTypeValue = this.leaves.source.value.slice(0);
        this.leaveTypeValue.sort(function (a, b) {
            var x = a.leave_type.toLowerCase();
            var y = b.leave_type.toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });

        console.log('byTypeDes', this.leaveTypeValue);
        // need to update the sorted list in html

    }
}



