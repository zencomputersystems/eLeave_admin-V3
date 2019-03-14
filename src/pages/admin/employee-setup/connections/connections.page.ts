import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-connections',
    templateUrl: './connections.page.html',
    styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

    public data: any = '';
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
            response => this.data = response.json()
        );

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.pageIndex = 1;
            this.totalItem = this.data.length;
            this.totalPageIndex = this.totalItem / this.itemsPerPage;
            this.totalPageIndex = Math.ceil(this.totalPageIndex);
            this.loopItemsPerPage(this.pageIndex);
        }, 1000);
    }

    loopItemsPerPage(index: number) {
        this.pageIndex = index;
        const startNum = (this.pageIndex * 6) - 5;
        const endNum = this.pageIndex * 6;
        const currentPageItems = [];
        for (let j = startNum - 1; j < endNum; j++) {
            const itemNum = this.data[j];
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
            this.loopItemsPerPage(index);
        }
        this.enableDisableNextButton();
    }

    clickToPrevPage(index: number) {
        if (!(index < 1)) {
            this.loopItemsPerPage(index);
        }
        this.enableDisablePrevButton();
    }

    sortAscName() {
        this.arrowDownName = true;
        this.data = this.data.slice(0);
        this.data.sort(function (a, b) {
            var x = a.employeeName.toLowerCase();
            var y = b.employeeName.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.loopItemsPerPage(1);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortDesName() {
        this.arrowDownName = false;
        this.data = this.data.slice(0);
        this.data.sort(function (a, b) {
            var x = a.employeeName.toLowerCase();
            var y = b.employeeName.toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });
        this.loopItemsPerPage(1);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortAscId() {
        this.arrowDownId = true;
        this.data = this.data.slice(0);
        this.data.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.loopItemsPerPage(1);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortDesId() {
        this.arrowDownId = false;
        this.data = this.data.slice(0);
        this.data.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? 1 : x > y ? -1 : 0;
        });
        this.loopItemsPerPage(1);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }



}
