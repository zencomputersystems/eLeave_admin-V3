import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveAPIService } from '../../leave-setup/leave-api.service';

/**
 * List for all leave policy
 * @export
 * @class PolicyListPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-policy-list',
    templateUrl: './policy-list.page.html',
    styleUrls: ['./policy-list.page.scss'],
})
export class PolicyListPage implements OnInit {

    /**
     * Role items get from API
     * @type {*}
     * @memberof PolicyListPage
     */
    public companyName: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof PolicyListPage
     */
    public showSpinner: boolean = true;

    /**
     * Content in page is hide during loading
     * @type {boolean}
     * @memberof PolicyListPage
     */
    public showPage: boolean = false;

    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof PolicyListPage
     */
    public arrowDownName: boolean = true;

    /**
     * Page number on current page
     * @type {number}
     * @memberof PolicyListPage
     */
    public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof PolicyListPage
     */
    public totalPageNum: number;

    /**
     * Items of the current showing page
     * @type {*}
     * @memberof PolicyListPage
     */
    public currentItems: any;

    /**
     * Value of disable next button
     * @type {boolean}
     * @memberof PolicyListPage
     */
    public disableNextButton: boolean;

    /**
     * Value of disable previous button
     * @type {boolean}
     * @memberof PolicyListPage
     */
    public disablePrevButton: boolean;

    /**
     *Creates an instance of PolicyListPage.
     * @param {Router} router
     * @memberof PolicyListPage
     */
    constructor(private router: Router, private leaveAPi: LeaveAPIService) { }


    ngOnInit() {
        this.leaveAPi.get_company_list().subscribe(data => {
            this.companyName = data;
            this.listOfPage(1);
            this.showSpinner = false;
            this.showPage = true;
            this.disableNextButton = false;
            this.disablePrevButton = true;
        }, error => {
            if (error) {
                window.location.href = '/login';
            }
        })
    }

    /**
     * Pass tenant company guid to route to edit policy details page
     * @param {*} id
     * @memberof PolicyListPage
     */
    getCompanyId(id) {
        this.router.navigate(['/main/general-leave-policy/edit-policy', id]);
    }


    /**
     * Sort ascending /descending order of company name column
     * @param {number} val1
     * @param {number} val2
     * @memberof PolicyListPage
     */
    nameSorting(val1: number, val2: number) {
        this.companyName.sort(function (a, b) {
            const x = a.NAME.toLowerCase();
            const y = b.NAME.toLowerCase();
            return x < y ? val1 : x > y ? val2 : 0;
        });
        this.listOfPage(1);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    /**
     * Calculate number of item show in each page
     * @param {number} i
     * @memberof PolicyListPage
     */
    listOfPage(i: number) {
        let totalNum;
        const itemOfPage = 6;
        const startEndVal = 5;
        this.pageIndex = i;
        totalNum = this.companyName.length;
        this.totalPageNum = totalNum / itemOfPage;
        this.totalPageNum = Math.ceil(this.totalPageNum);
        const start = (this.pageIndex * itemOfPage) - startEndVal;
        const end = this.pageIndex * itemOfPage;
        const pageItems = [];
        for (let j = start - 1; j < end; j++) {
            const itemNum = this.companyName[j];
            if (itemNum !== undefined) {
                pageItems.push(itemNum);
            }
        }
        this.currentItems = pageItems;
    }

    /**
     * Click to display next page of rendered items
     * @param {number} i
     * @memberof PolicyListPage
     */
    nextPage(i: number) {
        if (!(i > this.totalPageNum)) {
            this.listOfPage(i);
        }
        this.buttonNext();
    }

    /**
     * Click to display previous page of rendered items
     * @param {number} i
     * @memberof PolicyListPage
     */
    prevPage(i: number) {
        if (!(i < 1)) {
            this.listOfPage(i);
        }
        this.buttonPrev();
    }

    /**
     * Enable or disable next button
     * @memberof PolicyListPage
     */
    buttonNext() {
        if (this.pageIndex > 1) {
            this.disablePrevButton = false;
        }
        if (this.pageIndex === this.totalPageNum) {
            this.disableNextButton = true;
        }
        if (this.pageIndex > 0 && this.pageIndex < this.totalPageNum) {
            this.disableNextButton = false;
        }
    }

    /**
     * Enable or disable previous button
     * @memberof PolicyListPage
     */
    buttonPrev() {
        if (this.pageIndex < this.totalPageNum) {
            this.disableNextButton = false;
        }
        if (this.pageIndex < 2) {
            this.disablePrevButton = true;
        }
        if (this.pageIndex > 1 && this.pageIndex === this.totalPageNum) {
            this.disablePrevButton = false;
        }
    }

}