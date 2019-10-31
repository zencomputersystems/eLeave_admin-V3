import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteListConfirmationComponent } from '../delete-list-confirmation/delete-list-confirmation.component';
import { MatDialog } from '@angular/material';
import { AdminInvitesApiService } from '../admin-invites-api.service';
import { DateDialogComponent } from '../date-dialog/date-dialog.component';
import * as _moment from 'moment';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { FormControl, Validators } from '@angular/forms';
const moment = _moment;

/**
 *
 * Invite List Page
 * @export
 * @class InviteListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-invite-list',
    templateUrl: './invite-list.component.html',
    styleUrls: ['./invite-list.component.scss'],
})
export class InviteListComponent implements OnInit {

    /**
     * Get user profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public list: any;

    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public arrowDownName: boolean = true;

    /**
     * To show arrow up or down icon for Id column
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public arrowDownId: boolean = true;

    /**
     * Total number of users profile list
     * @type {number}
     * @memberof InviteListComponent
     */
    public totalItem: number;

    /**
     * Set the page items of each page
     * @type {number}
     * @memberof InviteListComponent
     */
    public itemsPerPage: number = 6;

    /**
     * Use for range calculation
     * @type {number}
     * @memberof InviteListComponent
     */
    public startEndNumber: number = 5;

    /**
     * Page number
     * @type {number}
     * @memberof InviteListComponent
     */
    public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof InviteListComponent
     */
    public totalPageIndex: number;

    /**
     * Get current page items
     * @type {*}
     * @memberof InviteListComponent
     */
    public currentPageItems: any;

    /**
     * Enable or disable next button
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public disableNextButton: boolean;

    /**
     * Enable or disable previous button
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public disablePrevButton: boolean = true;

    /**
     * To show user profile list in list view
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public listView: boolean = false;

    /**
     * To show user profile list in grid view
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public gridView: boolean = false;

    // /**
    //  * Add as favourite list after clicked star icon
    //  * @memberof InviteListComponent
    //  */
    // public favouriteList = [];

    /**
     * Show spinner during loading
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public showSpinner: boolean = true;

    /**
     * hide content during loading
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public showContent: boolean = false;

    /**
     * main checkbox value
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public mainCheck: boolean = false;

    /**
     * main checkbox show indeterminate 
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public indeterminateCheck: boolean = false;

    /**
     * hover to hide avatar
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public hideAvatar: boolean[] = [];

    p: number;

    public mode: string = 'OFF';

    public personalDetails: any;

    public employmentDetails: any;

    public dateOfJoin: any;

    public dateConfirm: any;

    public dateResign: any;

    public roleList: any;

    public calendarList: any;

    public workingList: any;

    public entitlementList: any;

    public userId: string;

    public dayAvailable: number = 0;

    public clickedIndex: number = 0;

    public thisPage: number = 0;


    /**
     *Creates an instance of InviteListComponent.
     * @param {AdminInvitesApiService} inviteAPI
     * @param {Router} router
     * @param {MatDialog} popUp
     * @memberof InviteListComponent
     */
    constructor(private inviteAPI: AdminInvitesApiService, public router: Router, public popUp: MatDialog) { }

    ngOnInit() {
        this.listView = false;
        this.endPoint();
        this.inviteAPI.get_role_profile_list().subscribe(list => {
            this.roleList = list;
        })
        this.inviteAPI.get_calendar_profile_list().subscribe(list => {
            this.calendarList = list;
        })
        this.inviteAPI.get_working_hour_profile_list().subscribe(list => {
            this.workingList = list;
        })
        this.inviteAPI.get_leavetype_entitlement().subscribe(list => {
            this.entitlementList = list;
        })
    }

    /**
     * Get user profile list from API
     * @memberof InviteListComponent
     */
    endPoint() {
        this.inviteAPI.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.showContent = true;
                this.list = data;
                // this.inviteAPI.get_admin_user_info('personal-details', this.list[0].userId).subscribe(data => {
                //     console.log(data);
                //     this.personalDetails = data;
                // })
                // this.inviteAPI.get_admin_user_info('employment-detail', this.list[0].userId).subscribe(data => {
                //     console.log('employ', data);
                //     this.employmentDetails = data;
                // this.dateOfJoin = new FormControl((this.employmentDetails.employmentDetail.dateOfJoin), Validators.required);
                // this.employmentDetails.employmentDetail.dateOfJoin = moment(this.employmentDetails.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
                // this.dateConfirm = new FormControl((this.employmentDetails.employmentDetail.dateOfConfirmation), Validators.required);
                // this.employmentDetails.employmentDetail.dateOfConfirmation = moment(this.employmentDetails.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
                // this.dateResign = new FormControl((this.employmentDetails.employmentDetail.dateOfResign), Validators.required);
                // this.employmentDetails.employmentDetail.dateOfResign = moment(this.employmentDetails.employmentDetail.dateOfResign).format('DD-MM-YYYY');
                // })
            }
        );
    }
    getUserId(userId, index, p) {
        console.log(((p - 1) * 7) + index);
        this.clickedIndex = ((p - 1) * 7) + index;
        this.userId = userId;
    }

    getLeaveTypeEntitlementId(leaveTypeId, leaveEntitlementId) {
        // POST and create directly
        const data = {
            "userId": [this.userId], "leaveTypeId": leaveTypeId, "leaveEntitlementId": leaveEntitlementId
        }
        this.inviteAPI.post_leave_entitlement(data).subscribe(res => {
            console.log('res', res);
        })
        this.inviteAPI.get_entilement_details(this.userId).subscribe(val => {
            console.log('entitledetails', val);
            for (let i = 0; i < val.length; i++) {
                if (val[i].LEAVE_TYPE_GUID == leaveTypeId) {
                    this.dayAvailable = val[i].BALANCE_DAYS;
                }
            }
        })
        console.log(leaveTypeId, leaveEntitlementId);
    }

    toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            this.popUp.open(EditModeDialogComponent, {
                data: 'employee',
                height: "354.3px",
                width: "383px"
            });
        } else {
            this.mode = 'OFF'
            this.inviteAPI.showSnackbar('Edit mode disabled. Good job!', true);
        }
    }

    /**
     * Show view list or grid list items
     * @param {boolean} list
     * @param {number} pageItems
     * @param {number} range
     * @memberof InviteListComponent
     */
    // viewType(list: boolean, pageItems: number, range: number) {
    //     this.listView = list;
    //     this.gridView = !list;
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    //     this.itemsPerPage = pageItems;
    //     this.startEndNumber = range;
    //     this.loopItemsPerPage(1);
    // }

    /**
     * Calculate number of item show in each page
     * @param {number} index
     * @param {*} data
     * @param {number} itemEachPage
     * @param {*} startEndNumber
     * @memberof InviteListComponent
     */
    // loopItemsPerPage(index: number) {
    //     this.pageIndex = index;
    //     this.totalItem = this.list.length;
    //     this.totalPageIndex = this.totalItem / this.itemsPerPage;
    //     this.totalPageIndex = Math.ceil(this.totalPageIndex);
    //     const startNum = (this.pageIndex * this.itemsPerPage) - this.startEndNumber;
    //     const endNum = this.pageIndex * this.itemsPerPage;
    //     const currentPageItems = [];
    //     for (let j = startNum - 1; j < endNum; j++) {
    //         const itemNum = this.list[j];
    //         if (itemNum !== undefined) {
    //             currentPageItems.push(itemNum);
    //         }
    //     }
    //     this.currentPageItems = currentPageItems;
    // }

    /**
     * Enable or disable the next button
     * @memberof InviteListComponent
     */
    // enableDisableNextButton() {
    //     if (this.pageIndex === this.totalPageIndex) {
    //         this.disableNextButton = true;
    //     }
    //     if (this.pageIndex > 0 && this.pageIndex < this.totalPageIndex) {
    //         this.disableNextButton = false;
    //     }
    //     if (this.pageIndex > 1) {
    //         this.disablePrevButton = false;
    //     }
    // }

    /**
     * Enable or disable the previous button
     * @memberof InviteListComponent
     */
    // enableDisablePrevButton() {
    //     if (this.pageIndex < 2) {
    //         this.disablePrevButton = true;
    //     }
    //     if (this.pageIndex > 1 && this.pageIndex === this.totalPageIndex) {
    //         this.disablePrevButton = false;
    //     }
    //     if (this.pageIndex < this.totalPageIndex) {
    //         this.disableNextButton = false;
    //     }
    // }

    /**
     * Show calculated content items after clicked next button
     * @param {number} index
     * @memberof InviteListComponent
     */
    // clickToNextPage(index: number) {
    //     if (!(index > this.totalPageIndex)) {
    //         this.loopItemsPerPage(index);
    //     }
    //     this.enableDisableNextButton();
    // }

    /**
     * Show calculated content items after clicked previous button
     * @param {number} index
     * @memberof InviteListComponent
     */
    // clickToPrevPage(index: number) {
    //     if (!(index < 1)) {
    //         this.loopItemsPerPage(index);
    //     }
    //     this.enableDisablePrevButton();
    // }

    /**
     * Sort Name column after clicked arrow up or down icon
     * @param {boolean} booleanValue
     * @param {number} ascValue
     * @param {number} desValue
     * @memberof InviteListComponent
     */
    // sortName(booleanValue: boolean, ascValue: number, desValue: number) {
    //     this.arrowDownName = booleanValue;
    //     this.list = this.list.slice(0);
    //     this.list.sort(function (a, b) {
    //         var x = a.employeeName.toLowerCase();
    //         var y = b.employeeName.toLowerCase();
    //         return x < y ? ascValue : x > y ? desValue : 0;
    //     });
    //     this.loopItemsPerPage(1);
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    // }

    /**
     * Sort Id column after clicked arrow up or down icon
     * @param {boolean} value
     * @param {number} asc
     * @param {number} des
     * @memberof InviteListComponent
     */
    // sortId(value: boolean, asc: number, des: number) {
    //     this.arrowDownId = value;
    //     this.list = this.list.slice(0);
    //     this.list.sort(function (a, b) {
    //         var x = a.staffNumber;
    //         var y = b.staffNumber;
    //         return x < y ? asc : x > y ? des : 0;
    //     });
    //     this.loopItemsPerPage(1);
    //     this.disableNextButton = false;
    //     this.disablePrevButton = true;
    // }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof InviteListComponent
     */
    filter(text: any) {
        if (text && text.trim() != '') {
            this.list = this.list.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            // this.pageIndex = 1;
            // this.loopItemsPerPage(this.pageIndex);
            // this.enableDisableNextButton();
            // this.enableDisablePrevButton();
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof InviteListComponent
     */
    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.endPoint();
            // this.disableNextButton = false;
            // this.disablePrevButton = true;
        } else {
            this.filter(text.srcElement.value);
        }
    }

    // /**
    //  * Check duplicate Id exist or not
    //  * @param {string} ID
    //  * @returns
    //  * @memberof InviteListComponent
    //  */
    // checkUserID(ID: string) {
    //     return this.favouriteList.some(function (el) {
    //         return el.itemId === ID;
    //     });
    // }

    /**
     * manage employee status 
     * @param {string} employeeName
     * @param {string} id
     * @param {string} name
     * @memberof InviteListComponent
     */
    setUserStatus(employeeName: string, id: string, name: string) {
        const deleteDialog = this.popUp.open(DeleteListConfirmationComponent, {
            data: { name: employeeName, value: id, action: name }
        });
        deleteDialog.afterClosed().subscribe(result => {
            if (result === id && name == 'delete') {
                this.showSpinner = true;
                this.showContent = false;
                this.inviteAPI.delete_user(id).subscribe(response => {
                    this.endPoint();
                })
            }
            if (result && name == 'disable') {
                this.disableUser(employeeName, id);
            }
        });
    }

    /**
     * disable user and set expiration date 
     * @param {string} employeeName
     * @param {string} id
     * @memberof InviteListComponent
     */
    disableUser(employeeName: string, id: string) {
        const disableDialog = this.popUp.open(DateDialogComponent, {
            data: { name: employeeName, value: id, action: name }
        });
        disableDialog.afterClosed().subscribe(value => {
            if (value) {
                this.showSpinner = true;
                this.showContent = false;
                this.inviteAPI.disable_user({
                    "user_guid": id,
                    "resign_date": moment(value).format('YYYY-MM-DD'),
                }).subscribe(response => {
                    this.endPoint();
                })
            }
        })
    }

    // /**
    //  * Save highlighted star icon name card
    //  * @param {number} index
    //  * @param {*} item
    //  * @memberof InviteListComponent
    //  */
    // saveAsFavourite(index: number, item: any) {
    //     const create = { index: index, itemId: item.id };
    //     const items = create;
    //     if (this.favouriteList.length > 0 && this.checkUserID(item.id)) {
    //         for (let i = 0; i < this.favouriteList.length; i++) {
    //             if (this.favouriteList[i].index == index && this.favouriteList[i].itemId == item.id) {
    //                 this.favouriteList.splice(i, 1);
    //             }
    //         }
    //     } else if (this.favouriteList.length > 0 && !this.checkUserID(item.id)) {
    //         this.favouriteList.push(items);
    //     } else {
    //         this.favouriteList.push(items);
    //     }
    // };

    /**
     * main checkbox value
     * @memberof InviteListComponent
     */
    // checkboxEvent() {
    //     this.hideAvatar = [];
    //     setTimeout(() => {
    //         this.list.forEach(value => {
    //             value.isChecked = this.mainCheck;
    //             if (value.isChecked) {
    //                 this.hideAvatar.push(true);
    //             } else {
    //                 this.hideAvatar.push(false);
    //             }
    //         });
    //     })
    // }

    /**
     * item checkbox value
     * @memberof InviteListComponent
     */
    // listEvent() {
    //     const totalNumber = this.list.length;
    //     let checkedLength = 0;
    //     this.list.map(item => {
    //         if (item.isChecked) {
    //             checkedLength++;
    //             this.hideAvatar.push(true);
    //         }
    //     });
    //     if (checkedLength > 0 && checkedLength < totalNumber) {
    //         this.indeterminateCheck = true;
    //         this.mainCheck = false;
    //     } else if (checkedLength == totalNumber) {
    //         this.mainCheck = true;
    //         this.indeterminateCheck = false;
    //     } else {
    //         this.indeterminateCheck = false;
    //         this.mainCheck = false;
    //     }
    // }

    /**
     * mouse in/out event
     * @param {number} idx
     * @param {boolean} value
     * @param {boolean} checkedValue
     * @memberof InviteListComponent
     */
    // mouseHoverEvent(idx: number, value: boolean, checkedValue: boolean) {
    //     if (checkedValue && (this.mainCheck || this.indeterminateCheck)) {
    //         this.hideAvatar = [];
    //         this.list.map(value => { this.hideAvatar.push(true); });
    //     } else if (!checkedValue && (this.mainCheck || this.indeterminateCheck)) {
    //         this.hideAvatar = [];
    //         this.list.map(() => { this.hideAvatar.push(true); });
    //     } else if (value && !checkedValue && !this.indeterminateCheck && !this.mainCheck) {
    //         this.hideAvatar.splice(idx, 1, true);
    //     } else {
    //         this.hideAvatar = [];
    //         this.list.map(value => { this.hideAvatar.push(false); });
    //     }
    // }

}
