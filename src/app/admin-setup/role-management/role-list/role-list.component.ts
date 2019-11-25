import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleApiService } from '../role-api.service';
import { MatDialog } from '@angular/material';
import { DialogDeleteConfirmationComponent } from '../dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';

/**
 * Show list of role
 * @export
 * @class RoleListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {

    /**
     * Role items get from API
     * @type {*}
     * @memberof RoleListComponent
     */
    public roleList: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public showSpinner: boolean = true;

    /**
     * Content in page is hide during loading
     * @type {boolean}
     * @memberof RoleListComponent
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
     * @memberof RoleListComponent
     */
    public arrowDownDes: boolean = true;

    /**
     * Page number on current page
     * @type {number}
     * @memberof RoleListComponent
     */
    public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof RoleListComponent
     */
    public sumPageIndex: number;

    /**
     * Items of the current showing page
     * @type {*}
     * @memberof RoleListComponent
     */
    public currentItems: any;

    /**
     * Value of disable next button
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public disabledNextButton: boolean;

    /**
     * Value of disable previous button
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public disabledPrevButton: boolean;

    public assignedNameList: any;

    public clickedIndex: number = 0;

    public mode: string = 'OFF';

    public roleIdOutput: string;

    /**
     *Creates an instance of RoleListComponent.
     * @param {RoleApiService} roleAPi
     * @param {Router} router
     * @memberof RoleListComponent
     */
    constructor(private roleAPi: RoleApiService, private router: Router, public dialog: MatDialog) { }

    /**
     * initial method to get endpoint list
     * @memberof RoleListComponent
     */
    ngOnInit() {
        this.roleAPi.get_role_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            // this.showContent = true;
            // this.renderItemPerPage(1);
            // this.disabledNextButton = false;
            // this.disabledPrevButton = true;
            this.clickedIndex = 0;
            this.selectedProfile(this.roleList[this.clickedIndex], this.clickedIndex)
            for (let i = 0; i < this.roleList.length; i++) {
                this.getAssignedEmployee(this.roleList[i].role_guid, i);
            }
        });
    }

    /**
     * get assigned employee from requested role iid
     * @param {string} roleId
     * @param {number} index
     * @memberof RoleListComponent
     */
    async getAssignedEmployee(roleId: string, index: number) {
        let a = await this.roleAPi.get_assigned_user_profile(roleId).toPromise();
        this.roleList[index]["employee"] = a.length;
    }

    /**
     * selected role profile
     * @param {*} item
     * @param {*} index
     * @memberof RoleListComponent
     */
    async selectedProfile(item, index) {
        this.clickedIndex = index;
        this.roleIdOutput = item.role_guid;
        let list = await this.roleAPi.get_assigned_user_profile(item.role_guid).toPromise();
        this.assignedNameList = list;
        for (let j = 0; j < this.assignedNameList.length; j++) {
            this.assignedNameList[j]["content"] = this.assignedNameList[j].FULLNAME;
            this.assignedNameList[j]["effectAllowed"] = "move";
            this.assignedNameList[j]["handle"] = true;
            this.assignedNameList[j]["disable"] = false;
        }
    }

    /**
     * toggle edit mode
     * @param {*} event
     * @memberof RoleListComponent
     */
    toggleMode(event) {
        if (event.detail.checked === true) {
            this.mode = 'ON';
            this.dialog.open(EditModeDialogComponent, {
                data: 'role',
                height: "354.3px",
                width: "383px"
            });

        } else {
            this.mode = 'OFF'
            this.roleAPi.snackbarMsg('Edit mode disabled. Good job!', true);
        }
    }

    /**
     * Pass role id to route to edit role details page
     * @param {*} roleId
     * @memberof RoleListComponent
     */
    // getRoleId(roleId) {
    //     this.router.navigate(['/main/role-management/role-rights', roleId]);
    // }

    /**
     * delete confirmation pop up dialog message
     * @param {*} role_guid
     * @memberof RoleListComponent
     */
    delete(role_guid: string, role_name: string) {
        const dialogRef = this.dialog.open(DialogDeleteConfirmationComponent, {
            data: { value: role_guid, name: role_name }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === role_guid) {
                this.roleAPi.delete_role_profile(role_guid).subscribe(response => {
                    this.ngOnInit();
                    // this.roleAPi.snackbarMsg('deleted successfully ');
                })
            }
        });
    }

    /**
     * Go to assign role page
     * @memberof RoleListComponent
     */
    // assignRole() {
    //     this.router.navigate(['/main/role-management/assign-role']);
    // }

    /**
     * Sort ascending /descending order of rolename & description column
     * @param {number} ascValue
     * @param {number} desValue
     * @param {*} variable
     * @memberof RoleListComponent
     */
    // sortFunction(ascValue: number, desValue: number, variable: any) {
    //     this.roleList.sort(function (a, b) {
    //         if (variable == 'code') {
    //             const x = a.code.toLowerCase();
    //             const y = b.code.toLowerCase();
    //             return x < y ? ascValue : x > y ? desValue : 0;
    //         } else {
    //             const x1 = a.description.toLowerCase();
    //             const x2 = b.description.toLowerCase();
    //             return x1 < x2 ? ascValue : x1 > x2 ? desValue : 0;
    //         }
    //     });
    //     this.renderItemPerPage(1);
    //     this.disabledNextButton = false;
    //     this.disabledPrevButton = true;
    // }

    /**
     * Calculate number of item show in each page
     * @param {number} i
     * @memberof RoleListComponent
     */
    // renderItemPerPage(i: number) {
    //     let totalItem;
    //     const pageItems = 7;
    //     const startEndNumber = 6;
    //     this.pageIndex = i;
    //     totalItem = this.roleList.length;
    //     this.sumPageIndex = totalItem / pageItems;
    //     this.sumPageIndex = Math.ceil(this.sumPageIndex);
    //     const startNum = (this.pageIndex * pageItems) - startEndNumber;
    //     const endNum = this.pageIndex * pageItems;
    //     const currentPageItems = [];
    //     for (let j = startNum - 1; j < endNum; j++) {
    //         const itemNum = this.roleList[j];
    //         if (itemNum !== undefined) {
    //             currentPageItems.push(itemNum);
    //         }
    //     }
    //     this.currentItems = currentPageItems;
    // }

    /**
     * Click to display next page of rendered items
     * @param {number} i
     * @memberof RoleListComponent
     */
    // onClickNextPage(i: number) {
    //     if (!(i > this.sumPageIndex)) {
    //         this.renderItemPerPage(i);
    //     }
    //     this.nextButton();
    // }

    /**
     * Click to display previous page of rendered items
     * @param {number} i
     * @memberof RoleListComponent
     */
    // onClickPrevPage(i: number) {
    //     if (!(i < 1)) {
    //         this.renderItemPerPage(i);
    //     }
    //     this.prevButton();
    // }

    /**
     * Enable or disable next button
     * @memberof RoleListComponent
     */
    // nextButton() {
    //     if (this.pageIndex === this.sumPageIndex) {
    //         this.disabledNextButton = true;
    //     }
    //     if (this.pageIndex > 0 && this.pageIndex < this.sumPageIndex) {
    //         this.disabledNextButton = false;
    //     }
    //     if (this.pageIndex > 1) {
    //         this.disabledPrevButton = false;
    //     }
    // }

    /**
     * Enable or disable previous button
     * @memberof RoleListComponent
     */
    // prevButton() {
    //     if (this.pageIndex < 2) {
    //         this.disabledPrevButton = true;
    //     }
    //     if (this.pageIndex > 1 && this.pageIndex === this.sumPageIndex) {
    //         this.disabledPrevButton = false;
    //     }
    //     if (this.pageIndex < this.sumPageIndex) {
    //         this.disabledNextButton = false;
    //     }
    // }

}