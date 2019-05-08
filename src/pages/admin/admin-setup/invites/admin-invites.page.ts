import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-invites',
    templateUrl: './admin-invites.page.html',
    styleUrls: ['./admin-invites.page.scss'],
})
export class AdminInvitesPage implements OnInit {

    public list: any;
    public arrowDownName: boolean = true;
    public arrowDownId: boolean = true;
    public totalItem: number;
    public itemsPerPage: number = 6;
    public startEndNumber: number = 5;
    public pageIndex: number;
    public totalPageIndex: number;
    public currentPageItems: any;
    public disableNextButton: boolean;
    public disablePrevButton: boolean = true;
    public listView: boolean = true;
    public gridView: boolean = false;
    public favouriteList = [];
    private _subscription: Subscription = new Subscription();

    public get personalList() {
        return this.currentPageItems;
    }

    constructor(private apiService: APIService, public router: Router) { }

    ngOnInit() {
        this.endPoint();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    endPoint() {
        this._subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.list = data;
                this.pageIndex = 1;
                this.loopItemsPerPage(this.pageIndex, this.list, this.itemsPerPage, this.startEndNumber);
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    viewOnList() {
        this.listView = true;
        this.gridView = false;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.itemsPerPage = 6;
        this.startEndNumber = 5;
        this.loopItemsPerPage(1, this.list, this.itemsPerPage, this.startEndNumber);
    }

    viewOnGrid() {
        this.listView = false;
        this.gridView = true;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.itemsPerPage = 8;
        this.startEndNumber = 7;
        this.loopItemsPerPage(1, this.list, this.itemsPerPage, this.startEndNumber);
    }

    loopItemsPerPage(index: number, data: any, itemEachPage: number, startEndNumber) {
        this.pageIndex = index;
        this.totalItem = this.list.length;
        this.totalPageIndex = this.totalItem / itemEachPage;
        this.totalPageIndex = Math.ceil(this.totalPageIndex);
        const startNum = (this.pageIndex * itemEachPage) - startEndNumber;
        const endNum = this.pageIndex * itemEachPage;
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
            this.loopItemsPerPage(index, this.list, this.itemsPerPage, this.startEndNumber);
        }
        this.enableDisableNextButton();
    }

    clickToPrevPage(index: number) {
        if (!(index < 1)) {
            this.loopItemsPerPage(index, this.list, this.itemsPerPage, this.startEndNumber);
        }
        this.enableDisablePrevButton();
    }

    sortName(booleanValue: boolean, ascValue: number, desValue: number) {
        this.arrowDownName = booleanValue;
        this.list = this.list.slice(0);
        this.list.sort(function (a, b) {
            var x = a.employeeName.toLowerCase();
            var y = b.employeeName.toLowerCase();
            return x < y ? ascValue : x > y ? desValue : 0;
        });
        this.loopItemsPerPage(1, this.list, this.itemsPerPage, this.startEndNumber);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    sortId(value: boolean, asc: number, des: number) {
        this.arrowDownId = value;
        this.list = this.list.slice(0);
        this.list.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? asc : x > y ? des : 0;
        });
        this.loopItemsPerPage(1, this.list, this.itemsPerPage, this.startEndNumber);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    filter(text: any) {
        if (text && text.trim() != '') {
            this.list = this.list.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })

            this.pageIndex = 1;
            this.loopItemsPerPage(this.pageIndex, this.list, this.itemsPerPage, this.startEndNumber);
            this.enableDisableNextButton();
            this.enableDisablePrevButton();
        }
    }

    clearDetails() {
        this.endPoint();
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.endPoint();
            this.disableNextButton = false;
            this.disablePrevButton = true;
        } else {
            this.filter(text.srcElement.value);
        }
    }

    checkUserID(ID: string) {
        return this.favouriteList.some(function (el) {
            return el.itemId === ID;
        });
    }

    saveAsFavourite(index: number, item: any) {
        const create = { index: index, itemId: item.id };
        const items = create;
        if (this.favouriteList.length > 0 && this.checkUserID(item.id)) {
            for (let i = 0; i < this.favouriteList.length; i++) {
                if (this.favouriteList[i].index == index && this.favouriteList[i].itemId == item.id) {
                    this.favouriteList.splice(i, 1);
                }
            }
        } else if (this.favouriteList.length > 0 && !this.checkUserID(item.id)) {
            this.favouriteList.push(items);
        } else {
            this.favouriteList.push(items);
        }
    };

}
