import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 *
 * Invite List Page
 * @export
 * @class InviteListPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-invite-list',
    templateUrl: './invite-list.page.html',
    styleUrls: ['./invite-list.page.scss'],
})
export class InviteListPage implements OnInit {

    /**
     * Get user profile list from API
     * @type {*}
     * @memberof InviteListPage
     */
    public list: any;

    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof InviteListPage
     */
    public arrowDownName: boolean = true;

    /**
     * To show arrow up or down icon for Id column
     * @type {boolean}
     * @memberof InviteListPage
     */
    public arrowDownId: boolean = true;

    /**
     * Total number of users profile list
     * @type {number}
     * @memberof InviteListPage
     */
    public totalItem: number;

    /**
     * Set the page items of each page
     * @type {number}
     * @memberof InviteListPage
     */
    public itemsPerPage: number = 6;

    /**
     * Use for range calculation
     * @type {number}
     * @memberof InviteListPage
     */
    public startEndNumber: number = 5;

    /**
     * Page number
     * @type {number}
     * @memberof InviteListPage
     */
    public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof InviteListPage
     */
    public totalPageIndex: number;

    /**
     * Get current page items
     * @type {*}
     * @memberof InviteListPage
     */
    public currentPageItems: any;

    /**
     * Enable or disable next button
     * @type {boolean}
     * @memberof InviteListPage
     */
    public disableNextButton: boolean;

    /**
     * Enable or disable previous button
     * @type {boolean}
     * @memberof InviteListPage
     */
    public disablePrevButton: boolean = true;

    /**
     * To show user profile list in list view
     * @type {boolean}
     * @memberof InviteListPage
     */
    public listView: boolean = false;

    /**
     * To show user profile list in grid view
     * @type {boolean}
     * @memberof InviteListPage
     */
    public gridView: boolean = false;

    /**
     * Add as favourite list after clicked star icon
     * @memberof InviteListPage
     */
    public favouriteList = [];

    /**
     * Show spinner during loading
     * @type {boolean}
     * @memberof InviteListPage
     */
    public showSpinner: boolean = true;

    /**
     * Add observable as disposable resource
     * @private
     * @type {Subscription}
     * @memberof InviteListPage
     */
    private _subscription: Subscription = new Subscription();

    /**
     * Return list of user profile for current page
     * @readonly
     * @memberof InviteListPage
     */
    public get personalList() {
        return this.currentPageItems;
    }

    /**
     *Creates an instance of InviteListPage.
     * @param {APIService} apiService
     * @param {Router} router
     * @memberof InviteListPage
     */
    constructor(private apiService: APIService, public router: Router) { }

    ngOnInit() {
        this.endPoint();
    }

    /**
     * Destroy or dispose subscription
     * @memberof InviteListPage
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    /**
     * Get user profile list from API
     * @memberof InviteListPage
     */
    endPoint() {
        this._subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.listView = true;
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

    /**
     * Show view list or grid list items
     * @param {boolean} list
     * @param {number} pageItems
     * @param {number} range
     * @memberof InviteListPage
     */
    viewType(list: boolean, pageItems: number, range: number) {
        this.listView = list;
        this.gridView = !list;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.itemsPerPage = pageItems;
        this.startEndNumber = range;
        this.loopItemsPerPage(1, this.list, this.itemsPerPage, this.startEndNumber);
    }

    /**
     * Calculate number of item show in each page
     * @param {number} index
     * @param {*} data
     * @param {number} itemEachPage
     * @param {*} startEndNumber
     * @memberof InviteListPage
     */
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

    /**
     * Enable or disable the next button
     * @memberof InviteListPage
     */
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

    /**
     * Enable or disable the previous button
     * @memberof InviteListPage
     */
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

    /**
     * Show calculated content items after clicked next button
     * @param {number} index
     * @memberof InviteListPage
     */
    clickToNextPage(index: number) {
        if (!(index > this.totalPageIndex)) {
            this.loopItemsPerPage(index, this.list, this.itemsPerPage, this.startEndNumber);
        }
        this.enableDisableNextButton();
    }

    /**
     * Show calculated content items after clicked previous button
     * @param {number} index
     * @memberof InviteListPage
     */
    clickToPrevPage(index: number) {
        if (!(index < 1)) {
            this.loopItemsPerPage(index, this.list, this.itemsPerPage, this.startEndNumber);
        }
        this.enableDisablePrevButton();
    }

    /**
     * Sort Name column after clicked arrow up or down icon
     * @param {boolean} booleanValue
     * @param {number} ascValue
     * @param {number} desValue
     * @memberof InviteListPage
     */
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

    /**
     * Sort Id column after clicked arrow up or down icon
     * @param {boolean} value
     * @param {number} asc
     * @param {number} des
     * @memberof InviteListPage
     */
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

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof InviteListPage
     */
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

    /**
     * Click icon to clear all text in searchbar
     * @memberof InviteListPage
     */
    clearDetails() {
        this.endPoint();
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof InviteListPage
     */
    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.endPoint();
            this.disableNextButton = false;
            this.disablePrevButton = true;
        } else {
            this.filter(text.srcElement.value);
        }
    }

    /**
     * Check duplicate Id exist or not
     * @param {string} ID
     * @returns
     * @memberof InviteListPage
     */
    checkUserID(ID: string) {
        return this.favouriteList.some(function (el) {
            return el.itemId === ID;
        });
    }

    /**
     * Save highlighted star icon name card
     * @param {number} index
     * @param {*} item
     * @memberof InviteListPage
     */
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
