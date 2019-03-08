import { Component, OnInit } from '@angular/core';
import { PersonalDetailsService } from 'src/services/employee-setup/personal-details.service.';
import { LeaveTypeService } from 'src/services/leave-type-setup/leave-type.service';

@Component({
    selector: 'app-leave-entitlement',
    templateUrl: './leave-entitlement.page.html',
    styleUrls: ['./leave-entitlement.page.scss'],
})
export class LeaveEntitlementPage implements OnInit {

    public leaves: any;
    public list: any;
    public personalDataList: any;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public arrowDown: boolean = true;
    leaveTypeValue: any;

    public get sortDirectionArrowDown(): boolean {
        return this.arrowDown;
    }

    public get leaveData() {
        return this.leaveTypeValue;
    }

    constructor(private _personalDetailsService: PersonalDetailsService,
        private _data: LeaveTypeService
    ) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this._personalDetailsService.getPersonalDetailsList()
            .subscribe(() => {
                this.list = this._personalDetailsService.personalData;
                // this.personalDataList = this._personalDetailsService.personalData;
                this.personalDataList = this.list.source.value;
                for (let i = 0; i < this.personalDataList.length; i++) {
                    const a = this.personalDataList[i];
                }
            });

        this._data.getLeaveTypeData()
            .subscribe(() => {
                this.leaves = this._data.leaveData;
            });
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



