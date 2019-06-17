import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Subscription } from 'rxjs';
/**
 * Invite More Page
 * @export
 * @class InviteMorePage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-invite-more',
    templateUrl: './invite-more.page.html',
    styleUrls: ['./invite-more.page.scss'],
})
export class InviteMorePage implements OnInit {

    /**
     * Get user profile list details
     * @type {*}
     * @memberof InviteMorePage
     */
    public employeeList: any;

    /**
     * Get user profile list details
     * @type {*}
     * @memberof InviteMorePage
     */
    public filterList: any;

    /**
     * Get key in text value from input searchbar
     * @type {string}
     * @memberof InviteMorePage
     */
    public inputValue: string;

    /**
     * Show filtered name content
     * @type {boolean}
     * @memberof InviteMorePage
     */
    public showDropDown: boolean;

    /**
     * Show or hide chips of selected name
     * @type {boolean}
     * @memberof InviteMorePage
     */
    public showChips: boolean;

    /**
     * Overall name list use to send out invitation
     * @type {*}
     * @memberof InviteMorePage
     */
    public dataList: any = [];

    /**
     * Selected name from searched value
     * @type {*}
     * @memberof InviteMorePage
     */
    public dataSelected: any = [];

    /**
     * User Id list to POST in API
     * @private
     * @type {*}
     * @memberof InviteMorePage
     */
    private _inviteList: any = [];

    /**
     * Add observable as disposable resource
     * @private
     * @type {Subscription}
     * @memberof InviteMorePage
     */
    private _subscription: Subscription = new Subscription();

    /**
     * To read component of searchbar
     * @type {*}
     * @memberof InviteMorePage
     */
    @ViewChild('searchbar') searchbar: any;

    /**
     * Return profile list content
     * @readonly
     * @memberof InviteMorePage
     */
    public get personalList() {
        return this.employeeList;
    }

    /**
     *Creates an instance of InviteMorePage.
     * @param {APIService} apiService
     * @memberof InviteMorePage
     */
    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.searchbar.setFocus();
        this._subscription = this.apiService.get_user_profile_list().subscribe(
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
     * Destroy or dispose subscription
     * @memberof InviteMorePage
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    /**
     * To filter value entered from searchbar
     * @param {*} text
     * @memberof InviteMorePage
     */
    filterDetails(text: any) {
        if (text && text.trim() != '') {
            this.filterList = this.employeeList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
        }
    }

    /**
     * Get input value from searchbar
     * To filter value
     * To reset empty searchbar
     * @param {*} text
     * @memberof InviteMorePage
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
     * @memberof InviteMorePage
     */
    deleteSearchText() {
        this.inputValue = null;
        this.showDropDown = false;
        this.filterList = this.filterList;
    }

    /**
     * Get user profile list when the searchbar is empty
     * @memberof InviteMorePage
     */
    reset(): void {
        this.showDropDown = false;
        this._subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.filterList = data;
            }
        );
    }

    /**
     * Update the clicked name list to show on searchbar
     * @param {*} valueSelected
     * @memberof InviteMorePage
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
     * @memberof InviteMorePage
     */
    removeContact(index: number, data: any) {
        this.dataList.splice(index, 1);
        this.filterList = this.employeeList.splice(1, 0, data);
    }

    /**
     * To delete chip name after clicked icon
     * @param {number} index
     * @param {*} data
     * @memberof InviteMorePage
     */
    deleteChip(index: number, data: any) {
        this.dataSelected.splice(index, 1);
        this.filterList = this.employeeList.splice(1, 0, data);
    }

    /**
     * To add the selected chips name to invitation list
     * @memberof InviteMorePage
     */
    addSelectedContact() {
        this.showChips = false;
        this.dataList = this.dataList.concat(this.dataSelected);
        this.dataSelected = [];
    }

    /**
     * Send invitation list to API
     * @memberof InviteMorePage
     */
    sendInvitation() {
        for (let i = 0; i < this.dataList.length; i++) {
            this._inviteList.push({ "id": this.dataList[i].id });
        }
        this._subscription = this.apiService.post_user_invite(this._inviteList).subscribe(
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