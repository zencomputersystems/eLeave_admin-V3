import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminInvitesApiService } from '../admin-invites-api.service';
/**
 * Invite More Page
 * @export
 * @class InviteMoreComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-invite-more',
    templateUrl: './invite-more.component.html',
    styleUrls: ['./invite-more.component.scss'],
})
export class InviteMoreComponent implements OnInit {

    /**
     * Get user profile list details
     * @type {*}
     * @memberof InviteMoreComponent
     */
    public employeeList: any;

    /**
     * Get user profile list details
     * @type {*}
     * @memberof InviteMoreComponent
     */
    public filterList: any;

    /**
     * Get key in text value from input searchbar
     * @type {string}
     * @memberof InviteMoreComponent
     */
    public inputValue: string;

    /**
     * Show filtered name content
     * @type {boolean}
     * @memberof InviteMoreComponent
     */
    public showDropDown: boolean;

    /**
     * Show or hide chips of selected name
     * @type {boolean}
     * @memberof InviteMoreComponent
     */
    public showChips: boolean;

    /**
     * Overall name list use to send out invitation
     * @type {*}
     * @memberof InviteMoreComponent
     */
    public dataList: any = [];

    /**
     * Selected name from searched value
     * @type {*}
     * @memberof InviteMoreComponent
     */
    public dataSelected: any = [];

    /**
     * User Id list to POST in API
     * @private
     * @type {*}
     * @memberof InviteMoreComponent
     */
    private _inviteList: any = [];

    /**
     * To read component of searchbar
     * @type {*}
     * @memberof InviteMoreComponent
     */
    @ViewChild('searchbar') searchbar: any;

    /**
     * Return profile list content
     * @readonly
     * @memberof InviteMoreComponent
     */
    public get personalList() {
        return this.employeeList;
    }

    /**
     *Creates an instance of InviteMoreComponent.
     * @param {APIService} apiService
     * @memberof InviteMoreComponent
     */
    constructor(private inviteAPI: AdminInvitesApiService) {
    }

    ngOnInit() {
        this.searchbar.setFocus();
        this.inviteAPI.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.employeeList = data;
                this.filterList = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    /**
     * To filter value entered from searchbar
     * @param {*} text
     * @memberof InviteMoreComponent
     */
    filterDetails(text: any) {
        if (text && text.trim() != '') {
            this.filterList = this.employeeList.filter((item: any) => {
                return (item.employeeName.toUpperCase().indexOf(text.toUpperCase()) > -1);
            })
        }
    }

    /**
     * Get input value from searchbar
     * To filter value
     * To reset empty searchbar
     * @param {*} text
     * @memberof InviteMoreComponent
     */
    getInputValue(text: any) {
        this.inputValue = text.srcElement.value;
        if (text.srcElement.value.length > 0) {
            this.showDropDown = true;
            this.filterDetails(this.inputValue);
        } else {
            this.reset();
        }
    }

    /**
     * To clear text after clicked on icon
     * @memberof InviteMoreComponent
     */
    deleteSearchText() {
        this.inputValue = null;
        this.showDropDown = false;
        this.filterList = this.filterList;
    }

    /**
     * Get user profile list when the searchbar is empty
     * @memberof InviteMoreComponent
     */
    reset(): void {
        this.showDropDown = false;
        this.inviteAPI.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.filterList = data;
            }
        );
    }

    /**
     * Update the clicked name list to show on searchbar
     * @param {*} valueSelected
     * @memberof InviteMoreComponent
     */
    updateTextBox(valueSelected: any) {
        this.showChips = true;
        this.dataSelected.push(valueSelected);
        this.showDropDown = false;
        this.inputValue = null;
        const removeIndex = this.employeeList.map(function (item) {
            return item.employeeName;
        }).indexOf(valueSelected.employeeName);
        this.employeeList.splice(removeIndex, 1);
        this.filterList = this.employeeList;
    }

    /**
     * Delete name from invitation list content after clicked on trash icon
     * @param {number} index
     * @param {*} data
     * @memberof InviteMoreComponent
     */
    removeContact(index: number, data: any) {
        this.dataList.splice(index, 1);
        this.filterList = this.employeeList.splice(1, 0, data);
    }

    /**
     * To delete chip name after clicked icon
     * @param {number} index
     * @param {*} data
     * @memberof InviteMoreComponent
     */
    deleteChip(index: number, data: any) {
        this.dataSelected.splice(index, 1);
        this.filterList = this.employeeList.splice(1, 0, data);
    }

    /**
     * To add the selected chips name to invitation list
     * @memberof InviteMoreComponent
     */
    addSelectedContact() {
        this.showChips = false;
        this.dataList = this.dataList.concat(this.dataSelected);
        this.dataSelected = [];
    }

    /**
     * Send invitation list to API
     * @memberof InviteMoreComponent
     */
    sendInvitation() {
        for (let i = 0; i < this.dataList.length; i++) {
            this._inviteList.push({ "id": this.dataList[i].id });
        }
        this.inviteAPI.post_user_invite(this._inviteList).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
            },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
            }
        );
    }


}