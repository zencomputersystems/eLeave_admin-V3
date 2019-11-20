import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveApiService } from '../../leave-setup/leave-api.service';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { MatDialog } from '@angular/material';
import { MenuController } from '@ionic/angular';
import { PolicyApiService } from '../policy-api.service';

/**
 * List for all leave policy
 * @export
 * @class PolicyListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-policy-list',
    templateUrl: './policy-list.component.html',
    styleUrls: ['./policy-list.component.scss'],
})
export class PolicyListComponent implements OnInit {

    /**
     * Role items get from API
     * @type {*}
     * @memberof PolicyListComponent
     */
    public companyName: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public showSpinner: boolean = true;

    /**
     * Content in page is hide during loading
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public showPage: boolean = false;

    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public arrowDownName: boolean = true;

    /**
     * Page number on current page
     * @type {number}
     * @memberof PolicyListComponent
     */
    public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof PolicyListComponent
     */
    public totalPageNum: number;

    /**
     * Items of the current showing page
     * @type {*}
     * @memberof PolicyListComponent
     */
    public currentItems: any;

    /**
     * Value of disable next button
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public disableNextButton: boolean;

    /**
     * Value of disable previous button
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public disablePrevButton: boolean;

    /**
     * edit mode value
     * @type {string}
     * @memberof PolicyListComponent
     */
    public modeValue: string = 'OFF';

    /**
     * index of clicked company name 
     * @type {number}
     * @memberof PolicyListComponent
     */
    public clickedIndex: number = 0;

    /**
     * selected leave policy details
     * @type {*}
     * @memberof PolicyListComponent
     */
    public policyDetails: any;

    /**
     *Creates an instance of PolicyListComponent.
     * @param {LeaveApiService} leaveAPi
     * @param {MatDialog} dialog
     * @param {MenuController} menu
     * @param {PolicyApiService} policyApi
     * @memberof PolicyListComponent
     */
    constructor(private leaveAPi: LeaveApiService, public dialog: MatDialog, public menu: MenuController, private policyApi: PolicyApiService) { }


    ngOnInit() {
        this.leaveAPi.get_company_list().subscribe(data => {
            this.companyName = data;
            this.clickedPolicy(this.companyName[0], 0);
            // this.listOfPage(1);
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
     * @memberof PolicyListComponent
     */
    // getCompanyId(id) {
    //     this.router.navigate(['/main/general-leave-policy/edit-policy', id]);
    // }


    /**
     * Sort ascending /descending order of company name column
     * @param {number} val1
     * @param {number} val2
     * @memberof PolicyListComponent
     */
    // nameSorting(val1: number, val2: number) {
    //     this.companyName.sort(function (a, b) {
    //         const x = a.NAME.toLowerCase();
    //         const y = b.NAME.toLowerCase();
    //         return x < y ? val1 : x > y ? val2 : 0;
    //     });
    //     this.listOfPage(1);
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    // }

    /**
     * Calculate number of item show in each page
     * @param {number} i
     * @memberof PolicyListComponent
     */
    // listOfPage(i: number) {
    //     let totalNum;
    //     const itemOfPage = 6;
    //     const startEndVal = 5;
    //     this.pageIndex = i;
    //     totalNum = this.companyName.length;
    //     this.totalPageNum = totalNum / itemOfPage;
    //     this.totalPageNum = Math.ceil(this.totalPageNum);
    //     const start = (this.pageIndex * itemOfPage) - startEndVal;
    //     const end = this.pageIndex * itemOfPage;
    //     const pageItems = [];
    //     for (let j = start - 1; j < end; j++) {
    //         const itemNum = this.companyName[j];
    //         if (itemNum !== undefined) {
    //             pageItems.push(itemNum);
    //         }
    //     }
    //     this.currentItems = pageItems;
    // }

    /**
     * Click to display next page of rendered items
     * @param {number} i
     * @memberof PolicyListComponent
     */
    // nextPage(i: number) {
    //     if (!(i > this.totalPageNum)) {
    //         this.listOfPage(i);
    //     }
    //     this.buttonNext();
    // }

    /**
     * Click to display previous page of rendered items
     * @param {number} i
     * @memberof PolicyListComponent
     */
    // prevPage(i: number) {
    //     if (!(i < 1)) {
    //         this.listOfPage(i);
    //     }
    //     this.buttonPrev();
    // }

    /**
     * Enable or disable next button
     * @memberof PolicyListComponent
     */
    // buttonNext() {
    //     if (this.pageIndex > 1) {
    //         this.disablePrevButton = false;
    //     }
    //     if (this.pageIndex === this.totalPageNum) {
    //         this.disableNextButton = true;
    //     }
    //     if (this.pageIndex > 0 && this.pageIndex < this.totalPageNum) {
    //         this.disableNextButton = false;
    //     }
    // }

    /**
     * Enable or disable previous button
     * @memberof PolicyListComponent
     */
    // buttonPrev() {
    //     if (this.pageIndex < this.totalPageNum) {
    //         this.disableNextButton = false;
    //     }
    //     if (this.pageIndex < 2) {
    //         this.disablePrevButton = true;
    //     }
    //     if (this.pageIndex > 1 && this.pageIndex === this.totalPageNum) {
    //         this.disablePrevButton = false;
    //     }
    // }

    /**
     * toggle edit mode
     * @param {*} evt
     * @memberof WorkingHourListComponent
     */
    toggleEvent(evt) {
        if (evt.detail.checked === true) {
            this.modeValue = 'ON';
            this.dialog.open(EditModeDialogComponent, {
                data: 'policy',
                height: "354.3px",
                width: "383px"
            });

        } else {
            this.modeValue = 'OFF'
            // this.workingHrAPI.showPopUp('Edit mode disabled. Good job!', true);
        }
    }

    clickedPolicy(item: any, index: number) {
        this.policyApi.get_general_leave_policy_id(item.TENANT_COMPANY_GUID).subscribe(list => {
            this.policyDetails = list;
        })
        this.clickedIndex = index;
    }

}