import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesAPIService } from '../role-api.service';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.page.html',
    styleUrls: ['./role-list.page.scss'],
})
export class RoleListPage implements OnInit {

    public roleList: any;
    public showSpinner: boolean = true;
    public showContent: boolean = false;
    public list: any;
    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof InviteListPage
     */
    public arrowDownName: boolean = true;

    public arrowDownDes: boolean = true;

    public pageIndex: number;

    public sumPageIndex: number;

    public currentItems: any;

    public disableNextButton: boolean;

    public disablePrevButton: boolean;

    constructor(private roleAPi: RolesAPIService, private router: Router) { }


    ngOnInit() {
        this.roleAPi.get_role_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.showContent = true;
            this.renderItemPerPage(1);
        },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            });
    }

    getRoleId(roleId) {
        this.router.navigate(['/main/role-management/role-rights', roleId]);
    }

    assignRole() {
        this.router.navigate(['/main/role-management/assign-role']);
    }

    sortName(ascValue: number, desValue: number, variable: any) {
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
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    /**
     * Calculate number of item show in each page
     * @param {number} i
     * @memberof RoleListPage
     */
    renderItemPerPage(i: number) {
        let totalItem;
        const pageItems = 6;
        const startEndNumber = 5;
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

    onClickNextPage(i: number) {
        if (!(i > this.sumPageIndex)) {
            this.renderItemPerPage(i);
        }
        this.enableDisableNextButton();
    }

    onClickPrevPage(i: number) {
        if (!(i < 1)) {
            this.renderItemPerPage(i);
        }
        this.enableDisablePrevButton();
    }

    enableDisableNextButton() {
        if (this.pageIndex === this.sumPageIndex) {
            this.disableNextButton = true;
        }
        if (this.pageIndex > 0 && this.pageIndex < this.sumPageIndex) {
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
        if (this.pageIndex > 1 && this.pageIndex === this.sumPageIndex) {
            this.disablePrevButton = false;
        }
        if (this.pageIndex < this.sumPageIndex) {
            this.disableNextButton = false;
        }
    }

}