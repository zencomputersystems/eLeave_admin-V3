import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-connections',
    templateUrl: './connections.page.html',
    styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

    public employeeList: any;
    public arrowDownName: boolean = true;
    public arrowDownId: boolean = true;
    public totalItem: number;
    public itemsPerPage: number = 6;
    public pageIndex: number;
    public totalPageIndex: number;
    public currentPageItems: any;
    public disableNextButton: boolean;
    public disablePrevButton: boolean = true;

    public get personalList() {
        return this.currentPageItems;
    }
    public get sortDirectionArrowDownName(): boolean {
        return this.arrowDownName;
    }
    public get sortDirectionArrowDownId(): boolean {
        return this.arrowDownId;
    }
    public get disabledNextButton() {
        return this.disableNextButton;
    }
    public get disabledPreviousButton() {
        return this.disablePrevButton;
    }
    constructor(private apiService: APIService) { }

    ngOnInit() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.employeeList = data;
                this.pageIndex = 1;
                this.loopItemsPerPage(this.pageIndex, this.employeeList);
            }
        );
    }

    loopItemsPerPage(index: number, data: any) {
        this.pageIndex = index;
        this.totalItem = this.employeeList.length;
        this.totalPageIndex = this.totalItem / this.itemsPerPage;
        this.totalPageIndex = Math.ceil(this.totalPageIndex);
        const startNum = (this.pageIndex * 6) - 5;
        const endNum = this.pageIndex * 6;
        const currentPageItems = [];
        for (let j = startNum - 1; j < endNum; j++) {
            const itemNum = data[j];
            if (itemNum !== undefined) {
                currentPageItems.push(itemNum);
            }
        }
        this.currentPageItems = currentPageItems;
    }

    enableDisableNextButton() {
        if (this.pageIndex === this.totalPageIndex) {
            this.disableNextButton = true;
        }
        if (this.pageIndex > 0 && this.pageIndex < this.totalPageIndex) {
            this.disableNextButton = false;
        }
        if (this.pageIndex > 1) {
            this.disablePrevButton = false;
        }
    }

    enableDisablePrevButton() {
        if (this.pageIndex < 2) {
            this.disablePrevButton = true;
        }
        if (this.pageIndex > 1 && this.pageIndex === this.totalPageIndex) {
            this.disablePrevButton = false;
        }
        if (this.pageIndex < this.totalPageIndex) {
            this.disableNextButton = false;
        }
    }

    clickToNextPage(index: number) {
        if (!(index > this.totalPageIndex)) {
            this.loopItemsPerPage(index, this.employeeList);
        }
        this.enableDisableNextButton();
    }

    clickToPrevPage(index: number) {
        if (!(index < 1)) {
            this.loopItemsPerPage(index, this.employeeList);
        }
        this.enableDisablePrevButton();
    }

    sortAscName() {
        this.arrowDownName = true;
        this.employeeList = this.employeeList.slice(0);
        this.employeeList.sort(function (a, b) {
            var x = a.employeeName.toLowerCase();
            var y = b.employeeName.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.loopItemsPerPage(1, this.employeeList);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortDesName() {
        this.arrowDownName = false;
        this.employeeList = this.employeeList.slice(0);
        this.employeeList.sort(function (a, b) {
            var x = a.employeeName.toLowerCase();
            var y = b.employeeName.toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });
        this.loopItemsPerPage(1, this.employeeList);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortAscId() {
        this.arrowDownId = true;
        this.employeeList = this.employeeList.slice(0);
        this.employeeList.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.loopItemsPerPage(1, this.employeeList);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortDesId() {
        this.arrowDownId = false;
        this.employeeList = this.employeeList.slice(0);
        this.employeeList.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? 1 : x > y ? -1 : 0;
        });
        this.loopItemsPerPage(1, this.employeeList);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    filterDetails(text: any) {
        if (text && text.trim() != '') {
            this.employeeList = this.employeeList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })

            this.pageIndex = 1;
            this.loopItemsPerPage(this.pageIndex, this.employeeList);
            this.enableDisableNextButton();
            this.enableDisablePrevButton();
        }
    }

    clearDetails() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.employeeList = data;
                this.pageIndex = 1;
                this.loopItemsPerPage(this.pageIndex, this.employeeList);
            }
        );
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.apiService.get_user_profile_list().subscribe(
                (data: any[]) => {
                    this.employeeList = data;
                    this.pageIndex = 1;
                    this.loopItemsPerPage(this.pageIndex, this.employeeList);
                }
            );
            this.disableNextButton = false;
            this.disablePrevButton = true;
        } else {
            this.filterDetails(text.srcElement.value);
        }
    }
}
