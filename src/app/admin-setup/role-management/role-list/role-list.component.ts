import { Component, OnInit } from '@angular/core';
import { RoleApiService } from '../role-api.service';
import { MatDialog } from '@angular/material';
import { DialogDeleteConfirmationComponent } from '../dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { APIService } from 'src/services/shared-service/api.service';

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

    /**
     * get assigned employee name list 
     * @type {*}
     * @memberof RoleListComponent
     */
    public assignedNameList: any;

    /**
     * selected index
     * @type {number}
     * @memberof RoleListComponent
     */
    public clickedIndex: number = 0;

    /**
     * toggle button mode value
     * @type {string}
     * @memberof RoleListComponent
     */
    public mode: string = 'OFF';

    /** 
     * role id value
     * @type {string}
     * @memberof RoleListComponent
     */
    public roleIdOutput: string;

    /**
     * user list
     * @private
     * @type {*}
     * @memberof RoleListComponent
     */
    private _userList: any;

    /**
     * filtered userId list of dragged user
     * @private
     * @type {*}
     * @memberof RoleListComponent
     */
    private _filteredList: any = [];

    /**
     *Creates an instance of RoleListComponent.
     * @param {RoleApiService} roleAPi
     * @param {MatDialog} dialog
     * @param {APIService} apiService
     * @memberof RoleListComponent
     */
    constructor(private roleAPi: RoleApiService, public dialog: MatDialog, private apiService: APIService) { }

    /**
     * initial method to get endpoint list
     * @memberof RoleListComponent
     */
    ngOnInit() {
        this.roleAPi.get_role_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.clickedIndex = 0;
            this.selectedProfile(this.roleList[this.clickedIndex], this.clickedIndex)
            this.getAssignedEmployee();

        });
        this.apiService.get_user_profile_list().subscribe(list => this._userList = list);
    }

    /**
     * dropped user to patch to the assigned role profile
     * @param {*} evt
     * @param {*} roleItem
     * @memberof RoleListComponent
     */
    onDropped(evt, roleItem) {
        for (let i = 0; i < this.assignedNameList.length; i++) {
            if (evt.data === this.assignedNameList[i].FULLNAME) {
                this.draggedUserId(i);
                this.roleAPi.patch_user_profile({
                    "user_guid": this._filteredList,
                    "role_guid": roleItem.role_guid
                }).subscribe(response => {
                    this.assignedNameList.splice(i, 1);
                    this._filteredList = [];
                    this.getAssignedEmployee();
                });
            }
        }
    }

    /**
     * get dragged item 
     * @param {number} i
     * @memberof RoleListComponent
     */
    async draggedUserId(i: number) {
        if (this.checkDuplicateName(this._userList, this.assignedNameList[i].FULLNAME) != 0) {
            const indexes: number = this.checkDuplicateName(this._userList, this.assignedNameList[i].FULLNAME);
            if (!this._filteredList.includes(this._userList[indexes].userId)) {
                await this._filteredList.push(this._userList[indexes].userId);
            }
        }
    }

    /**
     * check duplicate employee name in the user list
     * @param {*} list
     * @param {*} obj
     * @returns
     * @memberof RoleListComponent
     */
    checkDuplicateName(list: any, obj: any) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].employeeName === obj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * get assigned employee from requested role iid
     * @param {string} roleId
     * @param {number} index
     * @memberof RoleListComponent
     */
    async getAssignedEmployee() {
        for (let i = 0; i < this.roleList.length; i++) {
            let a = await this.roleAPi.get_assigned_user_profile(this.roleList[i].role_guid).toPromise();
            this.roleList[i]["employee"] = a.length;
        }
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