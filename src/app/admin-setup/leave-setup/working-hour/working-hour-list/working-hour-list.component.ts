import { OnInit, Component } from "@angular/core";
import { WorkingHourApiService } from "../working-hour-api.service";
import { MatDialog } from "@angular/material";
import { DeleteCalendarConfirmationComponent } from "../../delete-calendar-confirmation/delete-calendar-confirmation.component";
import { MenuController } from "@ionic/angular";
import { EditModeDialogComponent } from "../../edit-mode-dialog/edit-mode-dialog.component";
import { SharedService } from "../../shared.service";
import { Platform } from "@ionic/angular";

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
     *Creates an instance of WorkingHourListComponent.
     * @param {WorkingHourApiService} workingHrAPI
     * @param {MatDialog} dialog open material dialog
     * @param {MenuController} menu
     * @memberof WorkingHourListComponent
     */
    constructor(private workingHrAPI: WorkingHourApiService, public dialog: MatDialog, private sharedService: SharedService,
        public workingHrPlatform: Platform) {
    }

    /**
     * initial method to get working hour list
     * @memberof WorkingHourListComponent
     */
    async ngOnInit() {
        this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
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
            this.dialog.open(EditModeDialogComponent, {
                data: 'working',
                height: "360.3px",
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
                let value = await this.workingHrAPI.patch_user_working_hours({
                    "user_guid": this._droppedUser,
                    "working_hours_guid": item.working_hours_guid
                }).toPromise();
                if (value[0].USER_INFO_GUID == undefined) {
                    this.workingHrAPI.showPopUp(value.status, false);
                }
                this.employeeList.splice(i, 1);
                this._droppedUser = [];
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
        if (this.checkName(this._users, this.employeeList[i].fullname) != 0) {
            const indexes = this.checkName(this._users, this.employeeList[i].fullname);
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
            if (arrayList[j].employeeName === element) {
                return j;
            }
        }
        return 0;
    }

    /**
     * delete working hour profile
     * @param {string} working_hour_guid
     * @param {string} name
     * @memberof WorkingHourListComponent
     */
    deleteWorkingHrProfile(working_hour_guid: string, name: string) {
        const dialogRef = this.dialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: name, value: working_hour_guid, desc: ' profile name' },
            height: "195px",
            width: "270px"
        });
        dialogRef.afterClosed().subscribe(val => {
            if (val === working_hour_guid) {
                this.workingHrAPI.delete_working_hours_profile(working_hour_guid).subscribe(response => {
                    if (response[0].WORKING_HOURS_GUID != undefined) {
                        this.clickedIndex = 0;
                        this.ngOnInit();
                        this.workingHrAPI.showPopUp('Working hour profile was deleted', true);
                    } else {
                        this.workingHrAPI.showPopUp(response.status, false);
                    }
                }, error => {
                    this.workingHrAPI.showPopUp(JSON.parse(error._body).status, false);
                })
            }
        });
    }
}