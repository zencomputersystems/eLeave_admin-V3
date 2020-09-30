import { ConfirmationWindowComponent } from './../../../../global/confirmation-window/confirmation-window.component';
import { OnInit, Component } from "@angular/core";
import { WorkingHourApiService } from "../working-hour-api.service";
import { DeleteCalendarConfirmationComponent } from "../../delete-calendar-confirmation/delete-calendar-confirmation.component";
import { EditModeDialogComponent } from "../../edit-mode-dialog/edit-mode-dialog.component";
import { SharedService } from "../../shared.service";
import { Platform, PopoverController } from "@ionic/angular";


/**
 * working hour profile list page
 * @export
 * @class WorkingHourListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-working-hour-list',
    templateUrl: './working-hour-list.component.html',
    styleUrls: ['./working-hour-list.component.scss'],
})
export class WorkingHourListComponent implements OnInit {

    /**
     * get profile list from endpoint
     * @type {*}
     * @memberof WorkingHourListComponent
     */
    public list: any;

    /**
     * show/hide assign page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showAssignPage: boolean = false;

    /**
     * show/hide list page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showListPage: boolean = true;

    /**
     * show loading spinner before reach the page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showSpinner: boolean = true;

    /**
     * set id as selected working hour guid
     * @type {string}
     * @memberof WorkingHourListComponent
     */
    public id: string;

    /**
     * set isDefaultProfile as default profile value (true/false)
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public isDefaultProfile: boolean = false;

    /**
     * clicked index of working profile
     * @type {number}
     * @memberof WorkingHourListComponent
     */
    public clickedIndex: number = 0;

    /**
     * assigned employee list
     * @type {*}
     * @memberof WorkingHourListComponent
     */
    public employeeList: any;

    /**
     * toggle button 
     * @type {string}
     * @memberof WorkingHourListComponent
     */
    public mode: string = 'OFF';

    /**
     * all user list
     * @private
     * @type {*}
     * @memberof WorkingHourListComponent
     */
    private _users: any;

    /**
     * dropped user list
     * @private
     * @type {any[]}
     * @memberof WorkingHourListComponent
     */
    private _droppedUser: any[] = [];

    /**
     * Bind value of checkbox status(appear) as indeterminate
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public isIndeterminateState: boolean;

    /**
     * Bind value of checkbox status(appear) as all checked
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public isCheckAll: boolean;

    /**
     * Bind profile list
     * @private
     * @type {*}
     * @memberof WorkingHourListComponent
     */
    private defaultProfileList: any;

    /**
     * Bind data of default working hour profile
     * @type {*}
     * @memberof WorkingHourListComponent
     */
    public defaultProfileInfo: any;

    /**
     *Creates an instance of WorkingHourListComponent.
     * @param {WorkingHourApiService} workingHrAPI
     * @param {SharedService} sharedService
     * @param {Platform} workingHrPlatform
     * @param {PopoverController} workingHrPopoverController
     * @memberof WorkingHourListComponent
     */
    constructor(private workingHrAPI: WorkingHourApiService, private sharedService: SharedService,
        public workingHrPlatform: Platform, private workingHrPopoverController: PopoverController) {
    }

    /**
     * initial method to get working hour list
     * @memberof WorkingHourListComponent
     */
    async ngOnInit() {
        // this.refreshList();

        this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
        this.defaultProfileList = await this.workingHrAPI.get_default_profile().toPromise();
        this.list.forEach(item => {
            item.isDefault = (item.working_hours_guid === this.defaultProfileList[0].WORKING_HOURS_PROFILE_GUID) ? true : false;
            if (item.working_hours_guid === this.defaultProfileList[0].WORKING_HOURS_PROFILE_GUID) {
                this.defaultProfileInfo = item;
            }
        });
        this.showSpinner = false;
        this.clickedCalendar(this.list[this.clickedIndex], this.clickedIndex);
        this.workingHrAPI.get_all_users_list().subscribe(
            data => {
                this._users = data;
            });
    }

    /**
     * clicked calendar to get index & details
     * @param {*} list
     * @param {*} index
     * @memberof WorkingHourListComponent
     */
    clickedCalendar(list, index) {
        this.clickedIndex = index;
        this.isDefaultProfile = list.isDefault;
        this.workingHrAPI.get_assigned_working_profile_user(list.working_hours_guid).subscribe(response => {
            this.employeeList = response;
            for (let j = 0; j < this.employeeList.length; j++) {
                this.employeeList[j]["content"] = this.employeeList[j].fullname;
                this.employeeList[j]["effectAllowed"] = "move";
                this.employeeList[j]["handle"] = true;
                this.employeeList[j]["disable"] = false;
            }
        })
    }

    /**
     * toggle edit mode
     * @param {*} evt
     * @memberof WorkingHourListComponent
     */
    toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            this.sharedService.dialog.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'working',
                height: "413px",
                width: "383px"
            });
        } else {
            this.mode = 'OFF';
            this.workingHrAPI.showPopUp('Edit mode disabled. Good job!', true);
        }
        this.sharedService.emitChange(this.mode);
    }

    /**
     * patch dropped user to API
     * @param {*} event
     * @param {*} item
     * @memberof WorkingHourListComponent
     */
    async dropEvent(event, item) {
        for (let i = 0; i < this.employeeList.length; i++) {
            if (event.data === this.employeeList[i].fullname) {
                this.draggedUser(i);
                try {
                    let value = await this.workingHrAPI.patch_user_working_hours({
                        "user_guid": this._droppedUser,
                        "working_hours_guid": item.working_hours_guid
                    }).toPromise();
                    this.employeeList.splice(i, 1);
                } catch (error) {
                    this.workingHrAPI.showPopUp(JSON.parse(error._body).status, false);
                }
                this._droppedUser = [];
                this.isCheckAll = false;
                this.isIndeterminateState = false;
                this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
            }
        }
    }

    /**
     * check dragged user name to get the userid
     * @param {number} i
     * @memberof WorkingHourListComponent
     */
    async draggedUser(i: number) {
        if (this.checkName(this._users, this.employeeList[i].user_guid) > -1) {
            const indexes = this.checkName(this._users, this.employeeList[i].user_guid);
            if (!this._droppedUser.includes(this._users[indexes].userId)) {
                await this._droppedUser.push(this._users[indexes].userId);
            }
        }
    }

    /** 
     * check name selected from user list
     * @param {*} arrayList
     * @param {*} element
     * @returns
     * @memberof WorkingHourListComponent
     */
    checkName(arrayList: any, element: any) {
        for (let j = 0; j < arrayList.length; j++) {
            if (arrayList[j].userId === element) {
                return j;
            }
        }
        return 0;
    }

    /**
     * delete working hour profile
     * @param {string} item
     * @param {string} name
     * @memberof WorkingHourListComponent
     */
    deleteWorkingHrProfile(item: any, name: string) {
        this.isDefaultProfile = item.isDefault;
        let dialogRef;
        if (this.isDefaultProfile === false) {
            dialogRef = this.sharedService.dialog.open(DeleteCalendarConfirmationComponent, {
                disableClose: true,
                data: { name: name, value: item.working_hours_guid, desc: ' working hour profile' },
                height: "195px",
                width: "270px"
            });
        } else {
            dialogRef = this.sharedService.dialog.open(DeleteCalendarConfirmationComponent, {
                disableClose: true,
                data: { name: name, value: item.working_hours_guid, desc: ' working hour profile', isDefault: 'default profile' },
                height: "240px",
                width: "270px"
            });
        }
        dialogRef.afterClosed().subscribe(val => {
            if (val === item.working_hours_guid) {
                this.workingHrAPI.delete_working_hours_profile(item.working_hours_guid).subscribe(response => {
                    if (response[0] !== undefined) {
                        if (response[0].WORKING_HOURS_GUID != undefined) {
                            this.clickedIndex = 0;
                            this.ngOnInit();
                            this.workingHrAPI.showPopUp('Working hour profile was deleted', true);
                        }
                        if (response[0].FULLNAME != undefined) {
                            this.workingHrAPI.showPopUp('Please re-assign user to delete this profile', false);
                        }
                    }
                    else {
                        this.workingHrAPI.showPopUp('Working hour profile was failed to delete', false);
                    }
                })
            }
        });
    }

    /**
     * This method is to check all the checkbox of assigned employees
     * @memberof WorkingHourListComponent
     */
    checkAllWorkingHourAssignedEmployees() {
        setTimeout(() => {
            this.employeeList.forEach(obj => {
                obj.checked = this.isCheckAll;
            })
        });
    }

    /**
     * This method is to check the select all checkbox status either the all
     * assigned employees is checked, some of assigned employees is check
     * or none of employees is checked.
     * @memberof WorkingHourListComponent
     */
    checkWorkingHourAssignedEmployees() {
        const totalItems = this.employeeList.length;
        let checked = 0;
        this.employeeList.map(obj => {
            if (obj.checked) checked++;
        });
        if (checked > 0 && checked < totalItems) {
            //If even one item is checked but not all
            this.isIndeterminateState = true;
            this.isCheckAll = false;
        } else if (checked == totalItems) {
            //If all are checked
            this.isCheckAll = true;
            this.isIndeterminateState = false;
        } else {
            //If none is checked
            this.isIndeterminateState = false;
            this.isCheckAll = false;
        }
    }

    /**
     * This method is to patch assigned employees into selected working hour profile
     * @param {*} workingProfileGuid This parameter is to pass the value of working hour profile guid
     * @memberof WorkingHourListComponent
     */
    async reassignToOtherWorkingProfile(workingProfileGuid) {
        this._droppedUser = this.employeeList.filter(list => list.checked === true).map(function (o) { return o.user_guid; });
        try {
            let value = await this.workingHrAPI.patch_user_working_hours({
                "user_guid": this._droppedUser,
                "working_hours_guid": workingProfileGuid
            }).toPromise();
        }
        catch (error) {
            this.workingHrAPI.showPopUp(JSON.parse(error._body).status, false);
        }
        this.employeeList = this.employeeList.filter(list => list.checked !== true);
        this.isCheckAll = false;
        this.isIndeterminateState = false;
        this._droppedUser = [];
        this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
    }

    /**
     * Change default working hour profile
     * @param {*} isDefault
     * @memberof WorkingHourListComponent
     */
    async changeDefaultWHProfile(isDefault, item) {
        if (this.defaultProfileInfo !== {}) {
            const confirmChangeDefault = await this.workingHrPopoverController.create({
                component: ConfirmationWindowComponent,
                componentProps: {
                    type: 'working hour',
                    currDefaultProfile: this.defaultProfileInfo,
                    newDefaultProfile: item
                },
                cssClass: 'confirmation-popover'
            });

            confirmChangeDefault.onDidDismiss().then(ret => {
                if (ret.data === true) {
                    this.workingHrAPI.post_profile_default('working-hour', item.working_hours_guid).subscribe(
                        data => {
                            this.refreshList();
                        }
                    );
                }
            })
            return await confirmChangeDefault.present();
        }
    }

    /**
     * Get working hour profile list & default working hour profile
     * @memberof WorkingHourListComponent
     */
    async refreshList() {
        this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
        this.defaultProfileList = await this.workingHrAPI.get_default_profile().toPromise();
        this.list.forEach(item => {
            item.isDefault = (item.working_hours_guid === this.defaultProfileList[0].WORKING_HOURS_PROFILE_GUID) ? true : false;
            if (item.working_hours_guid === this.defaultProfileList[0].WORKING_HOURS_PROFILE_GUID) {
                this.defaultProfileInfo = item;
            }
        });
    }
}