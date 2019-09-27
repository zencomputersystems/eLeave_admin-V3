import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesAPIService } from '../role-api.service';
import { MatDialog } from '@angular/material';
import { DialogDeleteConfirmationPage } from '../dialog-delete-confirmation/dialog-delete-confirmation.component';

/**
 * Show list of role
 * @export
 * @class RoleListPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
})
export class RoleListPage implements OnInit {

    /**
     * Role items get from API
     * @type {*}
     * @memberof RoleListPage
     */
    public roleList: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof RoleListPage
     */
    public showSpinner: boolean = true;

    /**
     * Content in page is hide during loading
     * @type {boolean}
     * @memberof RoleListPage
     */
    public showContent: boolean = false;

    /**
     * To show arrow up or down icon for Rolename column
     * @type {boolean}
     * @memberof InviteListPage
     */
    public arrowDownName: boolean = true;

    /**
     * To show arrow up or down icon for Description column
     * @type {boolean}
     * @memberof RoleListPage
     */
    public arrowDownDes: boolean = true;

    /**
     * Page number on current page
     * @type {number}
     * @memberof RoleListPage
     */
    public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof RoleListPage
     */
    public sumPageIndex: number;

    /**
     * Items of the current showing page
     * @type {*}
     * @memberof RoleListPage
     */
    public currentItems: any;

    /**
     * Value of disable next button
     * @type {boolean}
     * @memberof RoleListPage
     */
    public disabledNextButton: boolean;

    /**
     * Value of disable previous button
     * @type {boolean}
     * @memberof RoleListPage
     */
    public disabledPrevButton: boolean;

    /**
     *Creates an instance of RoleListPage.
     * @param {RolesAPIService} roleAPi
     * @param {Router} router
     * @memberof RoleListPage
     */
    constructor(private roleAPi: RolesAPIService, private router: Router, public dialog: MatDialog) { }


    ngOnInit() {
        this.roleAPi.get_role_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.showContent = true;
            this.renderItemPerPage(1);
            this.disabledNextButton = false;
            this.disabledPrevButton = true;
        },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * Pass role id to route to edit role details page
     * @param {*} roleId
     * @memberof RoleListPage
     */
    getRoleId(roleId) {
        this.router.navigate(['/main/role-management/role-rights', roleId]);
    }

    /**
     * delete confirmation pop up dialog message
     * @param {*} role_guid
     * @memberof RoleListPage
     */
    delete(role_guid: string, role_name: string) {
        const dialogRef = this.dialog.open(DialogDeleteConfirmationPage, {
            data: { value: role_guid, name: role_name }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === role_guid) {
                this.roleAPi.delete_role_profile(role_guid).subscribe(response => {
                    this.ngOnInit();
                    this.roleAPi.snackbarMsg('deleted successfully ');
                })
            }
        });
    }

    /**
     * Go to assign role page
     * @memberof RoleListPage
     */
    assignRole() {
        this.router.navigate(['/main/role-management/assign-role']);
    }

    /**
     * Sort ascending /descending order of rolename & description column
     * @param {number} ascValue
     * @param {number} desValue
     * @param {*} variable
     * @memberof RoleListPage
     */
    sortFunction(ascValue: number, desValue: number, variable: any) {
        this.roleList.sort(function (a, b) {
            if (variable == 'code') {
                const x = a.code.toLowerCase();
                const y = b.code.toLowerCase();
                return x < y ? ascValue : x > y ? desValue : 0;
            } else {
                const x1 = a.description.toLowerCase();
                const x2 = b.description.toLowerCase();
                return x1 < x2 ? ascValue : x1 > x2 ? desValue : 0;
            }
        });
        this.renderItemPerPage(1);
        this.disabledNextButton = false;
        this.disabledPrevButton = true;
    }

    /**
     * Calculate number of item show in each page
     * @param {number} i
     * @memberof RoleListPage
     */
    renderItemPerPage(i: number) {
        let totalItem;
        const pageItems = 7;
        const startEndNumber = 6;
        this.pageIndex = i;
        totalItem = this.roleList.length;
        this.sumPageIndex = totalItem / pageItems;
        this.sumPageIndex = Math.ceil(this.sumPageIndex);
        const startNum = (this.pageIndex * pageItems) - startEndNumber;
        const endNum = this.pageIndex * pageItems;
        const currentPageItems = [];
        for (let j = startNum - 1; j < endNum; j++) {
            const itemNum = this.roleList[j];
            if (itemNum !== undefined) {
                currentPageItems.push(itemNum);
            }
        }
        this.currentItems = currentPageItems;
    }

    /**
     * Click to display next page of rendered items
     * @param {number} i
     * @memberof RoleListPage
     */
    onClickNextPage(i: number) {
        if (!(i > this.sumPageIndex)) {
            this.renderItemPerPage(i);
        }
        this.nextButton();
    }

    /**
     * Click to display previous page of rendered items
     * @param {number} i
     * @memberof RoleListPage
     */
    onClickPrevPage(i: number) {
        if (!(i < 1)) {
            this.renderItemPerPage(i);
        }
        this.prevButton();
    }

    /**
     * Enable or disable next button
     * @memberof RoleListPage
     */
    nextButton() {
        if (this.pageIndex === this.sumPageIndex) {
            this.disabledNextButton = true;
        }
        if (this.pageIndex > 0 && this.pageIndex < this.sumPageIndex) {
            this.disabledNextButton = false;
        }
        if (this.pageIndex > 1) {
            this.disabledPrevButton = false;
        }
    }

    /**
     * Enable or disable previous button
     * @memberof RoleListPage
     */
    prevButton() {
        if (this.pageIndex < 2) {
            this.disabledPrevButton = true;
        }
        if (this.pageIndex > 1 && this.pageIndex === this.sumPageIndex) {
            this.disabledPrevButton = false;
        }
        if (this.pageIndex < this.sumPageIndex) {
            this.disabledNextButton = false;
        }
    }

}